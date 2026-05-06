// 博主管理API路由
import { NextRequest, NextResponse } from 'next/server'
import { bloggerDB } from '@/lib/blogger-db'
import { BLOGGER_STATUS, COMMISSION_RATE_RANGE, Blogger } from '@/lib/blogger-types'

// GET /api/blogger - 获取博主列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as Blogger['status'] | null
    
    const bloggers = await bloggerDB.listBloggers(status || undefined)
    
    return NextResponse.json({
      success: true,
      data: bloggers,
      total: bloggers.length,
    })
  } catch (error) {
    console.error('Error listing bloggers:', error)
    return NextResponse.json(
      { success: false, error: '获取博主列表失败' },
      { status: 500 }
    )
  }
}

// POST /api/blogger - 创建新博主
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      douyin_id,
      name,
      avatar,
      bio,
      followers,
      category,
      commission_rate,
      contact_wechat,
      contact_phone,
      contact_email,
      fee_type,
      fixed_fee,
      webhook_url,
      webhook_type,
      note,
    } = body

    // 验证必填字段
    if (!douyin_id || !name || !followers || !category) {
      return NextResponse.json(
        { success: false, error: '缺少必填字段：douyin_id, name, followers, category' },
        { status: 400 }
      )
    }

    // 检查抖音号是否已存在
    const existing = await bloggerDB.getBloggerByDouyinId(douyin_id)
    if (existing) {
      return NextResponse.json(
        { success: false, error: '该抖音号已被注册' },
        { status: 409 }
      )
    }

    // 验证佣金比例
    const rate = commission_rate || COMMISSION_RATE_RANGE.DEFAULT
    if (rate < COMMISSION_RATE_RANGE.MIN || rate > COMMISSION_RATE_RANGE.MAX) {
      return NextResponse.json(
        { success: false, error: `佣金比例需在${COMMISSION_RATE_RANGE.MIN * 100}%-${COMMISSION_RATE_RANGE.MAX * 100}%之间` },
        { status: 400 }
      )
    }

    const blogger = await bloggerDB.createBlogger({
      douyin_id,
      name,
      avatar,
      bio,
      followers: Number(followers),
      category,
      status: BLOGGER_STATUS.PENDING,
      commission_rate: rate,
      contact_wechat,
      contact_phone,
      contact_email,
      fee_type: fee_type || 'cps',
      fixed_fee,
      webhook_url,
      webhook_type: webhook_type || 'none',
      note,
    })

    return NextResponse.json({
      success: true,
      data: blogger,
      message: '博主创建成功，等待审核',
    })
  } catch (error) {
    console.error('Error creating blogger:', error)
    return NextResponse.json(
      { success: false, error: '创建博主失败' },
      { status: 500 }
    )
  }
}

// PUT /api/blogger - 批量更新博主状态
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids, action, ...data } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: '请提供博主ID列表' },
        { status: 400 }
      )
    }

    if (!action) {
      return NextResponse.json(
        { success: false, error: '请提供操作类型（action）' },
        { status: 400 }
      )
    }

    const results = []
    for (const id of ids) {
      if (action === 'activate') {
        const updated = await bloggerDB.updateBlogger(id, { status: 'active' })
        if (updated) results.push(updated)
      } else if (action === 'deactivate') {
        const updated = await bloggerDB.updateBlogger(id, { status: 'inactive' })
        if (updated) results.push(updated)
      } else if (action === 'update') {
        const updated = await bloggerDB.updateBlogger(id, data)
        if (updated) results.push(updated)
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      updated: results.length,
    })
  } catch (error) {
    console.error('Error updating bloggers:', error)
    return NextResponse.json(
      { success: false, error: '更新博主失败' },
      { status: 500 }
    )
  }
}
