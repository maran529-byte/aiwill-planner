import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lawyerId, date, time, name, phone, notes } = body

    if (!lawyerId || !date || !time || !name || !phone) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      )
    }

    // Create booking in memory
    const booking = await db.createBooking(
      'anonymous',
      '',
      '',
      'standard',
      date,
      time,
      phone,
      '',
      notes || ''
    )

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error('Lawyer booking error:', error)
    return NextResponse.json(
      { error: '预约失败' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Return all bookings (for admin)
  return NextResponse.json({ bookings: Array.from(db.bookings.values()) })
}
