import { NextRequest, NextResponse } from 'next/server'
import { BloggerDB } from '@/lib/blogger-db'

const db = new BloggerDB()

// POST /api/commission/webhook - 触发博主佣金通知
// 接收订单数据，查找对应博主，发送飞书/企微通知
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order_id, blogger_id, tier_id, amount, commission } = body

    if (!order_id || !blogger_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 获取博主信息
    const blogger = db.getBlogger(blogger_id)
    if (!blogger) {
      return NextResponse.json({ error: 'Blogger not found' }, { status: 404 })
    }

    if (blogger.status !== 'active' || !blogger.webhook_url) {
      return NextResponse.json({ message: 'Blogger not active or no webhook configured' })
    }

    // 套餐名称映射
    const tierNames: Record<string, string> = {
      'limited': '基础版（¥29.9）',
      'ai-only': 'AI专属版（¥199）',
      'ai-lawyer': 'AI律师版（¥699）',
    }

    const tierName = tierNames[tier_id] || tier_id
    const now = new Date().toLocaleDateString('zh-CN')

    // 构建通知消息
    const message = {
      msg_type: 'text',
      content: {
        text: `🎉 新订单通知

📦 订单号：${order_id}
💰 套餐类型：${tierName}
💵 订单金额：¥${amount}
💸 您的佣金：¥${commission?.toFixed(2) || '0.00'}

⏰ 时间：${now}

感谢推广，继续加油！🌟`,
      },
    }

    // 根据 webhook_type 发送通知
    if (blogger.webhook_type === 'feishu') {
      // 飞书机器人 WebHook
      const feishuRes = await fetch(blogger.webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      })

      if (!feishuRes.ok) {
        console.error('Feishu webhook failed:', await feishuRes.text())
        return NextResponse.json({ error: 'Feishu notification failed' }, { status: 500 })
      }
    } else if (blogger.webhook_type === 'wecom') {
      // 企业微信机器人 WebHook
      const wecomRes = await fetch(blogger.webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      })

      if (!wecomRes.ok) {
        console.error('WeCom webhook failed:', await wecomRes.text())
        return NextResponse.json({ error: 'WeCom notification failed' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, message: 'Notification sent' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
