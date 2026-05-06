// 推广链接追踪API
import { NextRequest, NextResponse } from 'next/server'
import { bloggerDB } from '@/lib/blogger-db'

// GET /api/affiliate/track - 记录链接点击并跳转
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ref = searchParams.get('ref')
    const blogger_id = searchParams.get('blogger')

    if (!ref) {
      return NextResponse.json(
        { success: false, error: '缺少ref参数' },
        { status: 400 }
      )
    }

    // 查找链接
    const link = await bloggerDB.getPromotionLinkByCode(ref)
    if (link) {
      // 增加点击数
      await bloggerDB.incrementLinkClicks(link.id)
    }

    // 重定向到目标页面（带上追踪参数）
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aiwill-planner.vercel.app'
    const destination = link?.target_url || baseUrl
    
    // 构造最终URL，保留ref参数
    const finalUrl = new URL(destination.split('?')[0])
    finalUrl.searchParams.set('ref', ref)
    if (blogger_id) finalUrl.searchParams.set('blogger', blogger_id)

    return NextResponse.redirect(finalUrl.toString(), { status: 302 })
  } catch (error) {
    console.error('Error tracking link:', error)
    // 追踪失败不影响跳转
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aiwill-planner.vercel.app'
    return NextResponse.redirect(baseUrl, { status: 302 })
  }
}
