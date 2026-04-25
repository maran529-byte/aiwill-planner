import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 })
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature') || ''

  let event: any
  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  if (supabaseUrl && supabaseServiceKey) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const tierId = session.metadata?.tierId
      const userId = session.metadata?.userId

      if (tierId && userId) {
        await supabase.from('orders').insert({
          user_id: userId,
          tier_id: tierId,
          stripe_session_id: session.id,
          amount: session.amount_total / 100,
          status: 'paid',
        })

        // 更新用户套餐
        await supabase
          .from('users')
          .update({ current_tier: tierId, tier_expires_at: null })
          .eq('id', userId)
      }
    }
  }

  return NextResponse.json({ received: true })
}
