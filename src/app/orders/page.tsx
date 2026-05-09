'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Order {
  id: string
  tier_id: string
  stripe_session_id: string
  amount: number
  status: string
  created_at: string
}

const TIER_NAMES: Record<string, string> = {
  basic: '基础版',
  standard: '标准版',
  premium: '高级版',
  ai_lawyer: '专业护航版',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (!data.user) {
          router.push('/auth?redirect=/orders')
        }
      })
      .catch(() => {
        router.push('/auth?redirect=/orders')
      })
  }, [router])

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders || [])
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xl">💝</span>
            </div>
            <span className="text-xl font-bold text-primary">爱的延续</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-primary transition">
              返回账户
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">支付记录</h1>
          <p className="text-gray-600">查看您的购买记录和订阅信息</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💳</span>
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">暂无购买记录</h2>
            <p className="text-gray-600 mb-6">您还没有购买任何服务</p>
            <Link
              href="/#document-types"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
            >
              立即购买
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary">
                        {TIER_NAMES[order.tier_id] || order.tier_id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        订单号: {order.stripe_session_id.slice(0, 20)}...
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">
                      ¥{(order.amount / 100).toFixed(2)}
                    </p>
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      order.status === 'paid' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status === 'paid' ? '已支付' : order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
