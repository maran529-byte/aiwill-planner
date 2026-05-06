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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { tierId, userId, bloggerId, ref } = session.metadata || {}

    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)

      // 1. 创建订单
      if (tierId && userId) {
        const orderData = {
          user_id: userId,
          tier_id: tierId,
          stripe_session_id: session.id,
          amount: session.amount_total / 100,
          status: 'paid',
          blogger_id: bloggerId || null,
          affiliate_ref: ref || null,
        }

        const { data: order, error } = await supabase
          .from('orders')
          .insert(orderData)
          .select()
          .single()

        if (!error && order) {
          // 2. 更新用户套餐
          await supabase
            .from('users')
            .update({ current_tier: tierId, tier_expires_at: null })
            .eq('id', userId)

          // 3. 如果有博主归因，记录affiliate订单并通知博主
          if (bloggerId && ref) {
            await handleAffiliateOrder(bloggerId, order, supabase)
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}

// 处理博主affiliate订单和通知
async function handleAffiliateOrder(bloggerId: string, order: any, supabase: any) {
  try {
    // 获取博主信息
    const { data: blogger } = await supabase
      .from('influencers')
      .select('*')
      .eq('id', bloggerId)
      .single()

    if (!blogger || blogger.status !== 'active') return

    // 计算佣金 (从配置文件读取PLATFORM_FEE_RATIO)
    const platformFeeRatio = 0.15
    const commissionRate = blogger.commission_rate || 0.10
    const grossCommission = order.amount * commissionRate
    const netCommission = grossCommission * (1 - platformFeeRatio)

    // 记录affiliate订单
    const affiliateOrder = {
      blogger_id: bloggerId,
      order_id: order.id,
      tier_id: order.tier_id,
      amount: order.amount,
      commission_rate: commissionRate,
      commission_amount: netCommission,
      status: 'pending',
    }

    await supabase.from('affiliate_orders').insert(affiliateOrder)

    // 触发博主通知
    await notifyBlogger(blogger, order, netCommission)

    console.log(`[Affiliate] Blogger ${bloggerId} earned ¥${netCommission.toFixed(2)} from order ${order.id}`)
  } catch (error) {
    console.error('[Affiliate] Error handling affiliate order:', error)
  }
}

// 通知博主（飞书/企微Webhook）
async function notifyBlogger(blogger: any, order: any, commission: number) {
  if (!blogger.webhook_url) return

  const tierNames: Record<string, string> = {
    'limited': '基础版',
    'ai-only': 'AI专属版',
'ai-lawyer': '专家护航版',
  }

  const tierName = tierNames[order.tier_id] || order.tier_id
  const message = {
    msg_type: 'text',
    content: {
      text: `🎉 新订单通知

您好，${blogger.name}

您的推广链接产生一笔新订单：

📦 套餐：${tierName}
💰 订单金额：¥${order.amount}
💵 您的佣金：¥${commission.toFixed(2)}

订单ID：${order.id}
时间：${new Date().toLocaleString('zh-CN')}

佣金将在结算日统一发放，感谢推广！`,
    },
  }

  try {
    await fetch(blogger.webhook_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    })
  } catch (error) {
    console.error('[Webhook] Failed to notify blogger:', error)
  }
}
