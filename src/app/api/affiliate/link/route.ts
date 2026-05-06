// 推广链接生成API
import { NextRequest, NextResponse } from 'next/server'
import { bloggerDB } from '@/lib/blogger-db'

// POST /api/affiliate/link - 生成推广链接
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { blogger_id, target_url } = body

    if (!blogger_id || !target_url) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数：blogger_id, target_url' },
        { status: 400 }
      )
    }

    // 验证博主存在且状态正常
    const blogger = await bloggerDB.getBloggerById(blogger_id)
    if (!blogger) {
      return NextResponse.json(
        { success: false, error: '博主不存在' },
        { status: 404 }
      )
    }

    if (blogger.status !== 'active') {
      return NextResponse.json(
        { success: false, error: '博主账号未激活，无法生成推广链接' },
        { status: 403 }
      )
    }

    // 生成唯一的推广码
    const linkCode = `${blogger.douyin_id}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aiwill-planner.vercel.app'
    const fullUrl = `${target_url}?ref=${linkCode}&blogger=${blogger_id}`

    const link = await bloggerDB.createPromotionLink({
      blogger_id,
      link_code: linkCode,
      target_url: fullUrl,
      utm_source: 'douyin',
      utm_medium: 'influencer',
      utm_campaign: blogger.douyin_id,
    })

    return NextResponse.json({
      success: true,
      data: {
        ...link,
        short_url: `${baseUrl}/r/${linkCode}`,
      },
      message: '推广链接生成成功',
    })
  } catch (error) {
    console.error('Error creating promotion link:', error)
    return NextResponse.json(
      { success: false, error: '生成推广链接失败' },
      { status: 500 }
    )
  }
}

// GET /api/affiliate/link - 获取博主的所有推广链接
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const blogger_id = searchParams.get('blogger_id')

    if (!blogger_id) {
      return NextResponse.json(
        { success: false, error: '缺少参数：blogger_id' },
        { status: 400 }
      )
    }

    const links = await bloggerDB.getPromotionLinksByBlogger(blogger_id)

    return NextResponse.json({
      success: true,
      data: links,
      total: links.length,
    })
  } catch (error) {
    console.error('Error listing promotion links:', error)
    return NextResponse.json(
      { success: false, error: '获取推广链接失败' },
      { status: 500 }
    )
  }
}
