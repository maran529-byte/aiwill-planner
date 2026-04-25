'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PRICING_TIERS } from '@/lib/config'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedTier = searchParams.get('tier')
  const [selectedTier, setSelectedTier] = useState(preselectedTier || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheckout = async (tierId: string) => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tierId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '创建订单失败')
        return
      }

      if (data.mode === 'development') {
        router.push(`/checkout/success?order_id=${data.orderId}&tier=${tierId}`)
      } else if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">选择您的方案</h1>
        <p className="text-gray-600 text-center mb-12">专业、可信赖的遗嘱规划服务</p>

        <div className="grid md:grid-cols-3 gap-4 md:gap-8">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`bg-white rounded-2xl shadow-lg p-8 transition-all ${
                tier.recommended ? 'ring-2 ring-blue-500 relative' : ''
              } ${selectedTier === tier.id ? 'ring-2 ring-primary shadow-xl scale-105' : ''}`}
            >
              {tier.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-sm px-4 py-1 rounded-full">
                  推荐
                </span>
              )}
              {selectedTier === tier.id && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-sm px-4 py-1 rounded-full">
                  已选择
                </span>
              )}
              <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
              {tier.tagline && (
                <p className="text-sm text-gray-500 mb-4">{tier.tagline}</p>
              )}
              <div className="mb-6">
                <span className="text-4xl font-bold">¥{tier.price}</span>
                {tier.id !== 'ai-only' && <span className="text-gray-500">/次</span>}
              </div>
              <p className="text-gray-600 mb-6">{tier.description}</p>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout(tier.id)}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-medium transition ${
                  tier.recommended
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                } disabled:opacity-50`}
              >
                {loading ? '处理中...' : '立即购买'}
              </button>
            </div>
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-center mt-6">{error}</p>
        )}
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 py-12 text-center">加载中...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
