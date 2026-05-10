import { NextRequest, NextResponse } from 'next/server'
import { bloggerDB } from '@/lib/blogger-db'
import { nanoid } from 'nanoid'

const db = bloggerDB

// GET /api/crm/promo-links - 获取推广链接列表
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const bloggerId = searchParams.get('blogger_id')

  try {
    let links
    if (bloggerId) {
      links = await db.getPromotionLinksByBlogger(bloggerId)
    } else {
      // 返回所有链接
      const all = Array.from(
        (db as any).promotionLinks?.values?.() || []
      )
      links = all
    }
    return NextResponse.json({ success: true, data: links })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch links' }, { status: 500 })
  }
}

// POST /api/crm/promo-links - 创建推广链接
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { blogger_id, target_url, utm_source, utm_medium, utm_campaign, plan_type, expires_at } = body

    if (!blogger_id || !target_url) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    // 生成短链接码
    const link_code = nanoid(8)

    const link = await db.createPromotionLink({
      blogger_id,
      link_code,
      target_url,
      utm_source: utm_source || 'douyin',
      utm_medium: utm_medium || 'affiliate',
      utm_campaign: utm_campaign || '',
      plan_type,
      expires_at,
    })

    return NextResponse.json({ success: true, data: link })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create link' }, { status: 500 })
  }
}
