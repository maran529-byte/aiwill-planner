import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: '缺少session_id' }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  // 开发模式
  if (!stripe || !sessionId.startsWith('cs_')) {
    return NextResponse.json({
      valid: true,
      tier: 'ai-lawyer',
      mode: 'development',
    })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ valid: false, error: '未支付' }, { status: 400 })
    }

    const tierId = session.metadata?.tierId || 'ai-only'
    const userId = session.metadata?.userId || ''

    // 验证并更新数据库
    if (supabaseUrl && supabaseServiceKey && userId) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('stripe_session_id', sessionId)

      await supabase
        .from('users')
        .update({ current_tier: tierId })
        .eq('id', userId)
    }

    return NextResponse.json({
      valid: true,
      tier: tierId,
      amount: (session.amount_total || 0) / 100,
    })
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json({ valid: false, error: '验证失败' }, { status: 500 })
  }
}
