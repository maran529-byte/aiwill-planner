// 博主单个操作API路由
import { NextRequest, NextResponse } from 'next/server'
import { bloggerDB } from '@/lib/blogger-db'

interface Params {
  params: Promise<{ id: string }>
}

// GET /api/blogger/[id] - 获取博主详情
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const blogger = await bloggerDB.getBloggerById(id)
    
    if (!blogger) {
      return NextResponse.json(
        { success: false, error: '博主不存在' },
        { status: 404 }
      )
    }

    // 获取该博主的推广链接和订单统计
    const links = await bloggerDB.getPromotionLinksByBlogger(id)
    const orders = await bloggerDB.getAffiliateOrdersByBlogger(id)
    const settlements = await bloggerDB.getSettlementsByBlogger(id)

    return NextResponse.json({
      success: true,
      data: {
        ...blogger,
        links,
        recent_orders: orders.slice(-10).reverse(),
        settlements,
      },
    })
  } catch (error) {
    console.error('Error getting blogger:', error)
    return NextResponse.json(
      { success: false, error: '获取博主详情失败' },
      { status: 500 }
    )
  }
}

// PATCH /api/blogger/[id] - 更新博主信息
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const existing = await bloggerDB.getBloggerById(id)
    if (!existing) {
      return NextResponse.json(
        { success: false, error: '博主不存在' },
        { status: 404 }
      )
    }

    // 佣金比例校验
    if (body.commission_rate !== undefined) {
      const rate = body.commission_rate
      if (rate < 0.05 || rate > 0.20) {
        return NextResponse.json(
          { success: false, error: '佣金比例需在5%-20%之间' },
          { status: 400 }
        )
      }
    }

    const updated = await bloggerDB.updateBlogger(id, body)

    return NextResponse.json({
      success: true,
      data: updated,
      message: '博主信息已更新',
    })
  } catch (error) {
    console.error('Error updating blogger:', error)
    return NextResponse.json(
      { success: false, error: '更新博主失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/blogger/[id] - 删除博主
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    
    const existing = await bloggerDB.getBloggerById(id)
    if (!existing) {
      return NextResponse.json(
        { success: false, error: '博主不存在' },
        { status: 404 }
      )
    }

    // 软删除：设置为inactive
    await bloggerDB.updateBlogger(id, { status: 'inactive' })

    return NextResponse.json({
      success: true,
      message: '博主已停用',
    })
  } catch (error) {
    console.error('Error deleting blogger:', error)
    return NextResponse.json(
      { success: false, error: '删除博主失败' },
      { status: 500 }
    )
  }
}
