// 博主CRM数据类型

export interface Blogger {
  id: string
  douyin_id: string          // 抖音号（唯一标识）
  name: string               // 博主名称
  avatar?: string            // 头像URL
  bio?: string               // 简介
  followers: number          // 粉丝数
  category: string           // 内容类别：情感/婚姻/家庭/法律等
  status: 'active' | 'inactive' | 'pending' | 'rejected'
  commission_rate: number    // 佣金比例（0.05-0.20）
  contact_wechat?: string    // 微信联系方式
  contact_phone?: string     // 手机号
  contact_email?: string     // 邮箱
  fee_type: 'cps' | 'fixed' | 'hybrid'  // 收费方式：CPS分润/固定费用/混合
  fixed_fee?: number         // 固定合作费用
  webhook_url?: string       // 订单通知webhook地址
  webhook_type: 'feishu' | 'wecom' | 'none'  // webhook类型
  note?: string              // 备注
  total_orders: number       // 总订单数
  total_sales: number        // 总销售额
  total_commission: number   // 总佣金
  created_at: string
  updated_at: string
}

export interface PromotionLink {
  id: string
  blogger_id: string
  link_code: string          // 短链接码
  target_url: string         // 完整目标URL
  utm_source: string         // utm_source=douyin
  utm_medium: string         // utm_medium=affiliate
  utm_campaign: string       // 博主抖音号
  plan_type?: string         // 指定套餐：limited/ai-only/ai-lawyer
  clicks: number             // 点击次数
  orders: number             // 带来的订单数
  sales: number              // 带来的销售额
  commission: number         // 产生的佣金
  created_at: string
  expires_at?: string        // 过期时间
}

export interface AffiliateOrder {
  id: string
  order_id: string           // 订单ID（关联主订单）
  blogger_id: string
  promotion_link_id: string
  tier_id: string            // 套餐ID
  tier_name: string          // 套餐名称
  amount: number             // 订单金额
  commission_rate: number    // 佣金比例
  commission_amount: number  // 佣金金额
  platform_fee: number       // 平台扣费
  blogger_earning: number    // 博主实收
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled'
  paid_at?: string           // 支付时间
  created_at: string
  updated_at: string
}

export interface CommissionSettlement {
  id: string
  blogger_id: string
  period: string             // 结算周期：2024-01
  total_orders: number       // 订单数
  total_sales: number        // 总销售额
  total_commission: number   // 总佣金
  platform_fee: number       // 平台管理费
  blogger_earning: number    // 博主实收
  status: 'pending' | 'processing' | 'paid' | 'rejected'
  paid_at?: string
  note?: string
  created_at: string
}

// 博主合作状态枚举
export const BLOGGER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  REJECTED: 'rejected',
} as const

// 佣金比例区间
export const COMMISSION_RATE_RANGE = {
  MIN: 0.05,   // 最低5%
  MAX: 0.20,   // 最高20%
  DEFAULT: 0.10, // 默认10%
} as const

// 套餐佣金配置
export const TIER_COMMISSION = {
  'limited': { rate: 0.08, name: '限时活动版' },
  'ai-only': { rate: 0.10, name: 'AI专属版' },
  'ai-lawyer': { rate: 0.12, name: '专家护航版' },
} as const
