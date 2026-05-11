import { NextRequest, NextResponse } from 'next/server'
import { bloggerDB } from '@/lib/blogger-db'

const db = bloggerDB

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

    settlements.sort((a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return NextResponse.json({ success: true, data: settlements })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch settlements' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { blogger_id, period, total_orders, total_sales, commission_rate = 10, remark } = body

    if (!blogger_id || !period) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const total_commission = total_sales * commission_rate / 100
    const platform_fee = total_commission * 0.15
    const blogger_earning = total_commission * 0.85

    const settlement = await db.createSettlement({
      blogger_id,
      period,
      total_orders: total_orders || 0,
      total_sales: total_sales || 0,
      total_commission,
      platform_fee,
      blogger_earning,
      status: 'pending',
      note: remark || '',
    })

    return NextResponse.json({ success: true, data: settlement })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create settlement' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ids, remark } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: 'Missing ids' }, { status: 400 })
    }

    for (const id of ids) {
      const settlement = (db as any).settlements?.get?.(id)
      if (!settlement) continue

      if (action === 'approve') {
        ;(db as any).settlements.set(id, { ...settlement, status: 'processing' })
      } else if (action === 'reject') {
        ;(db as any).settlements.set(id, { ...settlement, status: 'rejected', note: remark || '' })
      } else if (action === 'pay') {
        ;(db as any).settlements.set(id, { 
          ...settlement, 
          status: 'paid', 
          paid_at: new Date().toISOString(),
          note: remark || settlement.note || '',
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update settlement' }, { status: 500 })
  }
}
