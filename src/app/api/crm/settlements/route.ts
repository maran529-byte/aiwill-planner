import { NextRequest, NextResponse } from 'next/server'
import { bloggerDB } from '@/lib/blogger-db'

const db = bloggerDB

// GET /api/crm/settlements - 获取结算记录
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const bloggerId = searchParams.get('blogger_id')
  const status = searchParams.get('status')

  try {
    let settlements = Array.from((db as any).settlements?.values?.() || [])

    if (bloggerId) {
      settlements = settlements.filter((s: any) => s.blogger_id === bloggerId)
    }
    if (status) {
      settlements = settlements.filter((s: any) => s.status === status)
    }

    // 按创建时间倒序
    settlements.sort((a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return NextResponse.json({ success: true, data: settlements })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch settlements' }, { status: 500 })
  }
}

// POST /api/crm/settlements - 创建结算记录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { blogger_id, period, amount, status = 'pending' } = body

    if (!blogger_id || !period || !amount) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const settlement = await db.createSettlement({
      blogger_id,
      period,
      amount,
      status,
    })

    return NextResponse.json({ success: true, data: settlement })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create settlement' }, { status: 500 })
  }
}
