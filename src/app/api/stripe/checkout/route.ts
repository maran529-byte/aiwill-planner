import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_PRICES } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { tierId, userId } = await request.json()

    if (!tierId || !STRIPE_PRICES[tierId]) {
      return NextResponse.json({ error: '无效的套餐' }, { status: 400 })
    }

    if (!stripe) {
      // 开发模式：直接返回成功
      return NextResponse.json({
        success: true,
        mode: 'development',
        orderId: `dev_order_${Date.now()}`,
        message: '开发模式，无需真实支付',
      })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_PRICES[tierId],
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&tier=${tierId}`,
      cancel_url: `${baseUrl}/checkout/cancel?tier=${tierId}`,
      metadata: {
        tierId,
        userId: userId || '',
      },
    })

    return NextResponse.json({ success: true, url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: '支付创建失败' }, { status: 500 })
  }
}
