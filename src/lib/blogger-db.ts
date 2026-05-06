// 博主CRM内存数据库（开发环境使用）
import type { Blogger, PromotionLink, AffiliateOrder, CommissionSettlement } from './blogger-types'

class BloggerDB {
  private bloggers: Map<string, Blogger> = new Map()
  private promotionLinks: Map<string, PromotionLink> = new Map()
  private affiliateOrders: Map<string, AffiliateOrder> = new Map()
  private settlements: Map<string, CommissionSettlement> = new Map()

  // ============ 博主管理 ============
  async createBlogger(data: Omit<Blogger, 'id' | 'created_at' | 'updated_at' | 'total_orders' | 'total_sales' | 'total_commission'>): Promise<Blogger> {
    const blogger: Blogger = {
      ...data,
      id: crypto.randomUUID(),
      total_orders: 0,
      total_sales: 0,
      total_commission: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.bloggers.set(blogger.id, blogger)
    return blogger
  }

  async getBloggerById(id: string): Promise<Blogger | null> {
    return this.bloggers.get(id) || null
  }

  async getBloggerByDouyinId(douyinId: string): Promise<Blogger | null> {
    return Array.from(this.bloggers.values()).find(b => b.douyin_id === douyinId) || null
  }

  async listBloggers(status?: Blogger['status']): Promise<Blogger[]> {
    const all = Array.from(this.bloggers.values())
    if (status) return all.filter(b => b.status === status)
    return all
  }

  async updateBlogger(id: string, data: Partial<Blogger>): Promise<Blogger | null> {
    const blogger = this.bloggers.get(id)
    if (!blogger) return null
    const updated = { ...blogger, ...data, updated_at: new Date().toISOString() }
    this.bloggers.set(id, updated)
    return updated
  }

  async deleteBlogger(id: string): Promise<boolean> {
    return this.bloggers.delete(id)
  }

  async updateBloggerStats(id: string): Promise<void> {
    const blogger = this.bloggers.get(id)
    if (!blogger) return
    
    const orders = Array.from(this.affiliateOrders.values()).filter(o => o.blogger_id === id)
    const confirmedOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'paid')
    
    blogger.total_orders = confirmedOrders.length
    blogger.total_sales = confirmedOrders.reduce((sum, o) => sum + o.amount, 0)
    blogger.total_commission = confirmedOrders.reduce((sum, o) => sum + o.commission_amount, 0)
    blogger.updated_at = new Date().toISOString()
    this.bloggers.set(id, blogger)
  }

  // ============ 推广链接管理 ============
  async createPromotionLink(data: Omit<PromotionLink, 'id' | 'created_at' | 'clicks' | 'orders' | 'sales' | 'commission'>): Promise<PromotionLink> {
    const link: PromotionLink = {
      ...data,
      id: crypto.randomUUID(),
      clicks: 0,
      orders: 0,
      sales: 0,
      commission: 0,
      created_at: new Date().toISOString(),
    }
    this.promotionLinks.set(link.id, link)
    return link
  }

  async getPromotionLinkByCode(code: string): Promise<PromotionLink | null> {
    return Array.from(this.promotionLinks.values()).find(l => l.link_code === code) || null
  }

  async getPromotionLinksByBlogger(bloggerId: string): Promise<PromotionLink[]> {
    return Array.from(this.promotionLinks.values()).filter(l => l.blogger_id === bloggerId)
  }

  async incrementLinkClicks(linkId: string): Promise<void> {
    const link = this.promotionLinks.get(linkId)
    if (link) {
      link.clicks++
      this.promotionLinks.set(linkId, link)
    }
  }

  async updateLinkStats(linkId: string): Promise<void> {
    const link = this.promotionLinks.get(linkId)
    if (!link) return
    
    const orders = Array.from(this.affiliateOrders.values()).filter(o => o.promotion_link_id === linkId && (o.status === 'confirmed' || o.status === 'paid'))
    link.orders = orders.length
    link.sales = orders.reduce((sum, o) => sum + o.amount, 0)
    link.commission = orders.reduce((sum, o) => sum + o.commission_amount, 0)
    this.promotionLinks.set(linkId, link)
  }

  // ============ 订单归因 ============
  async createAffiliateOrder(data: Omit<AffiliateOrder, 'id' | 'created_at' | 'updated_at'>): Promise<AffiliateOrder> {
    const order: AffiliateOrder = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.affiliateOrders.set(order.id, order)
    
    // 更新统计
    await this.updateBloggerStats(data.blogger_id)
    await this.updateLinkStats(data.promotion_link_id)
    
    return order
  }

  async getAffiliateOrderByOrderId(orderId: string): Promise<AffiliateOrder | null> {
    return Array.from(this.affiliateOrders.values()).find(o => o.order_id === orderId) || null
  }

  async getAffiliateOrdersByBlogger(bloggerId: string): Promise<AffiliateOrder[]> {
    return Array.from(this.affiliateOrders.values()).filter(o => o.blogger_id === bloggerId)
  }

  async updateAffiliateOrderStatus(id: string, status: AffiliateOrder['status'], paidAt?: string): Promise<AffiliateOrder | null> {
    const order = this.affiliateOrders.get(id)
    if (!order) return null
    order.status = status
    order.updated_at = new Date().toISOString()
    if (paidAt) order.paid_at = paidAt
    this.affiliateOrders.set(id, order)
    
    if (status === 'confirmed' || status === 'paid') {
      await this.updateBloggerStats(order.blogger_id)
      await this.updateLinkStats(order.promotion_link_id)
    }
    
    return order
  }

  // ============ 佣金结算 ============
  async createSettlement(data: Omit<CommissionSettlement, 'id' | 'created_at'>): Promise<CommissionSettlement> {
    const settlement: CommissionSettlement = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }
    this.settlements.set(settlement.id, settlement)
    return settlement
  }

  async getSettlementsByBlogger(bloggerId: string): Promise<CommissionSettlement[]> {
    return Array.from(this.settlements.values()).filter(s => s.blogger_id === bloggerId)
  }

  async getSettlementByPeriod(bloggerId: string, period: string): Promise<CommissionSettlement | null> {
    return Array.from(this.settlements.values()).find(s => s.blogger_id === bloggerId && s.period === period) || null
  }

  async updateSettlementStatus(id: string, status: CommissionSettlement['status'], paidAt?: string): Promise<CommissionSettlement | null> {
    const settlement = this.settlements.get(id)
    if (!settlement) return null
    settlement.status = status
    if (paidAt) settlement.paid_at = paidAt
    this.settlements.set(id, settlement)
    return settlement
  }
}

export const bloggerDB = new BloggerDB()
