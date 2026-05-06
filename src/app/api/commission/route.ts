import { NextRequest, NextResponse } from 'next/server'
import { BloggerDB } from '@/lib/blogger-db'
import { PLATFORM_FEE_RATIO } from '@/lib/config'

const db = new BloggerDB()

// GET /api/commission/calculate - 计算博主佣金
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const bloggerId = searchParams.get('blogger_id')

  if (!bloggerId) {
    return NextResponse.json({ error: 'Missing blogger_id' }, { status: 400 })
  }

  const blogger = db.getBlogger(bloggerId)
  if (!blogger) {
    return NextResponse.json({ error: 'Blogger not found' }, { status: 404 })
  }

  const orders = db.getAffiliateOrders(bloggerId)
  const commissionRate = blogger.commission_rate

  // 按状态分组统计
  const pending = orders.filter(o => o.status === 'pending')
  const settled = orders.filter(o => o.status === 'settled')

  const pendingCommission = pending.reduce((sum, o) => {
    const gross = o.amount * commissionRate
    return sum + gross * (1 - PLATFORM_FEE_RATIO)
  }, 0)

  const settledCommission = settled.reduce((sum, o) => {
    const gross = o.amount * commissionRate
    return sum + gross * (1 - PLATFORM_FEE_RATIO)
  }, 0)

  return NextResponse.json({
    blogger_id: bloggerId,
    commission_rate: commissionRate,
    platform_fee_ratio: PLATFORM_FEE_RATIO,
    orders_count: orders.length,
    pending_orders: pending.length,
    settled_orders: settled.length,
    pending_commission: pendingCommission,
    settled_commission: settledCommission,
    total_commission: pendingCommission + settledCommission,
  })
}

// POST /api/commission/settle - 结算佣金（标记为已结算）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { blogger_id, order_ids } = body

    if (!blogger_id) {
      return NextResponse.json({ error: 'Missing blogger_id' }, { status: 400 })
    }

    const blogger = db.getBlogger(blogger_id)
    if (!blogger) {
      return NextResponse.json({ error: 'Blogger not found' }, { status: 404 })
    }

    // 更新订单状态为已结算
    let updatedCount = 0
    for (const orderId of order_ids || []) {
      const success = db.settleAffiliateOrder(blogger_id, orderId)
      if (success) updatedCount++
    }

    return NextResponse.json({
      success: true,
      updated_count: updatedCount,
      message: `${updatedCount} 笔订单已标记为结算`,
    })
  } catch (error) {
    console.error('Settle error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
