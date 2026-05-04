'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { DOCUMENT_TYPES } from '@/lib/config'

// 套餐名称映射
function getTierName(tierId: string): string {
  const names: Record<string, string> = {
    'limited': '限时活动版',
    'ai-only': 'AI专属版',
    'ai-lawyer': '律师护航版',
  }
  return names[tierId] || tierId
}

// 套餐价格映射
function getTierPrice(tierId: string): string {
  const prices: Record<string, string> = {
    'limited': '29.9',
    'ai-only': '199',
    'ai-lawyer': '699',
  }
  return prices[tierId] || '0'
}

export default function CheckoutSuccessPage() {
  const [sessionData, setSessionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDocType, setSelectedDocType] = useState('will')
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const orderId = params.get('order_id')
    const tier = params.get('tier')
    const sessionId = params.get('session_id')

    if (orderId && tier) {
      // 开发模式：直接从 URL 参数获取
      setSessionData({
        orderId,
        tierId: tier,
        tierName: getTierName(tier),
        amount: getTierPrice(tier),
        mode: 'development',
      })
      setLoading(false)
    } else if (sessionId) {
      // 生产模式：验证 session
      fetch(`/api/stripe/verify?session_id=${sessionId}`)
        .then(r => r.json())
        .then(data => {
          if (data.valid) {
            setSessionData({
              sessionId,
              tierId: data.tier,
              tierName: getTierName(data.tier),
              amount: data.amount,
              mode: 'production',
            })
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">验证订单中...</p>
        </div>
      </div>
    )
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">订单信息不存在</h1>
          <p className="text-gray-600 mb-6">无法找到您的订单信息，请联系客服</p>
          <Link href="/checkout" className="btn-primary block text-center w-full py-3">
            返回购买页面
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">支付成功！</h1>
          <p className="text-gray-600">感谢您的信任，我们已收到您的付款</p>
        </div>

        {/* Order Details */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-primary mb-4">订单信息</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">订单编号</span>
              <span className="text-primary font-mono">
                {sessionData.mode === 'development'
                  ? sessionData.orderId?.slice(-8)
                  : sessionData.sessionId?.slice(-8)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">套餐类型</span>
              <span className="text-primary font-medium">
                {sessionData?.tierName || '爱的延续套餐'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">支付金额</span>
              <span className="text-accent font-bold text-lg">
                ¥{sessionData?.amount || '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">支付状态</span>
              <span className="text-green-600 font-medium">已支付</span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-primary mb-4">接下来</h2>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">1.</span>
              <span>您可以立即开始填写AI问卷，系统会根据您的回答生成个性化人生规划</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">2.</span>
              <span>{sessionData.tierId === 'ai-lawyer' ? '您的专属律师将在24小时内与您联系' : '您可随时在个人中心查看订单状态'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">3.</span>
              <span>您可以随时登录查看和管理您的人生规划文档</span>
            </li>
          </ul>
        </div>

        {/* Document Type Selection */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-primary mb-4">选择要创建的文书</h2>
          <div className="grid grid-cols-3 gap-3">
            {DOCUMENT_TYPES.slice(0, 6).map(doc => (
              <button
                key={doc.id}
                onClick={() => setSelectedDocType(doc.id)}
                className={`p-3 rounded-lg border-2 text-center transition ${
                  selectedDocType === doc.id
                    ? 'border-accent bg-accent/5 text-primary'
                    : 'border-gray-200 hover:border-accent/50'
                }`}
              >
                <span className="text-xl mb-1 block">{doc.icon}</span>
                <span className="text-xs font-medium">{doc.name}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            {DOCUMENT_TYPES.slice(6).map(doc => (
              <button
                key={doc.id}
                onClick={() => setSelectedDocType(doc.id)}
                className={`p-3 rounded-lg border-2 text-center transition ${
                  selectedDocType === doc.id
                    ? 'border-accent bg-accent/5 text-primary'
                    : 'border-gray-200 hover:border-accent/50'
                }`}
              >
                <span className="text-xl mb-1 block">{doc.icon}</span>
                <span className="text-xs font-medium">{doc.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link href={`/questionnaire?type=${selectedDocType}`} className="btn-primary block text-center w-full py-3">
            开始填写AI问卷 📋
          </Link>
          <Link href="/dashboard" className="btn-secondary block text-center w-full py-3">
            返回个人中心
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-center text-xs text-gray-400 mt-6">
          如有疑问，请联系客服：400-123-4567
        </p>
      </div>
    </div>
  )
}
