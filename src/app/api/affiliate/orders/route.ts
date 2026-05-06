import { NextRequest, NextResponse } from 'next/server'
import { BloggerDB } from '@/lib/blogger-db'

const db = new BloggerDB()

// GET /api/affiliate/orders - 获取博主订单列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bloggerId = searchParams.get('blogger_id')

    if (!bloggerId) {
      return NextResponse.json({ error: 'Missing blogger_id' }, { status: 400 })
    }

    const orders = db.getAffiliateOrders(bloggerId)

    return NextResponse.json({
      orders: orders.map(order => ({
        id: order.order_id,
        tier_name: order.tier_id,
        amount: order.amount,
        commission: order.commission,
        created_at: order.created_at,
      })),
    })
  } catch (error) {
    console.error('Failed to fetch affiliate orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
