'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface BloggerStats {
  id: string
  name: string
  followers: number
  commission_rate: number
  total_orders: number
  total_earnings: number
  pending_commission: number
  paid_commission: number
}

interface AffiliateLink {
  id: string
  code: string
  url: string
  clicks: number
  orders: number
  created_at: string
}

interface RecentOrder {
  id: string
  tier_name: string
  amount: number
  commission: number
  created_at: string
}

export default function BloggerDashboardPage() {
  const [stats, setStats] = useState<BloggerStats | null>(null)
  const [links, setLinks] = useState<AffiliateLink[]>([])
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [bloggerId, setBloggerId] = useState('')
  const [newLinkLoading, setNewLinkLoading] = useState(false)
  const router = useRouter()

  // 获取博主ID（从localStorage或url param）
  useEffect(() => {
    const storedId = localStorage.getItem('blogger_id')
    const urlParams = new URLSearchParams(window.location.search)
    const urlId = urlParams.get('blogger_id')

    const id = urlId || storedId || ''
    setBloggerId(id)

    if (!id) {
      setLoading(false)
      return
    }

    localStorage.setItem('blogger_id', id)
    fetchBloggerData(id)
  }, [])

  const fetchBloggerData = async (id: string) => {
    try {
      // 获取博主信息
      const bloggerRes = await fetch(`/api/blogger/${id}`)
      if (bloggerRes.ok) {
        const blogger = await bloggerRes.json()
        setStats({
          id: blogger.id,
          name: blogger.name,
          followers: blogger.followers,
          commission_rate: blogger.commission_rate,
          total_orders: 0,
          total_earnings: 0,
          pending_commission: 0,
          paid_commission: 0,
        })
      }

      // 获取推广链接列表
      const linksRes = await fetch(`/api/affiliate/link?blogger_id=${id}`)
      if (linksRes.ok) {
        const linksData = await linksRes.json()
        setLinks(linksData.links || [])
      }

      // 获取最近订单
      const ordersRes = await fetch(`/api/affiliate/orders?blogger_id=${id}`)
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setRecentOrders(ordersData.orders || [])
      }
    } catch (error) {
      console.error('Failed to fetch blogger data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateNewLink = async () => {
    if (!bloggerId) {
      alert('请先设置博主ID')
      return
    }

    setNewLinkLoading(true)
    try {
      const res = await fetch('/api/affiliate/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogger_id: bloggerId,
          name: `推广链接-${new Date().toLocaleDateString('zh-CN')}`,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setLinks(prev => [data.link, ...prev])
      }
    } catch (error) {
      console.error('Failed to generate link:', error)
    } finally {
      setNewLinkLoading(false)
    }
  }

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('链接已复制！')
  }

  const tierNames: Record<string, string> = {
    'limited': '基础版',
    'ai-only': 'AI专属版',
    'ai-lawyer': 'AI律师版',
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary">加载中...</div>
      </div>
    )
  }

  if (!bloggerId) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">🔗</div>
          <h1 className="text-2xl font-bold text-primary mb-4">博主推广中心</h1>
          <p className="text-gray-600 mb-6">请输入您的博主ID以访问推广后台</p>
          <input
            type="text"
            value={bloggerId}
            onChange={e => setBloggerId(e.target.value)}
            placeholder="输入博主ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
          />
          <button
            onClick={() => {
              if (bloggerId) {
                localStorage.setItem('blogger_id', bloggerId)
                fetchBloggerData(bloggerId)
              }
            }}
            className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            进入后台
          </button>
          <div className="mt-6 text-left">
            <p className="text-sm text-gray-500 mb-2">示例博主ID（测试用）：</p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">blogger_001, blogger_002, blogger_003</code>
          </div>
        </div>
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
            <span className="text-gray-600">博主推广中心</span>
            <Link href="/dashboard" className="text-primary hover:underline text-sm">
              返回主站
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            博主推广中心
          </h1>
          <p className="text-gray-600">
            欢迎回来，{stats?.name || '博主'}！您的专属推广链接和收益数据如下。
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-primary">{stats?.total_orders || 0}</div>
            <div className="text-gray-600 text-sm">总订单数</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-green-600">¥{((stats?.total_earnings || 0)).toFixed(2)}</div>
            <div className="text-gray-600 text-sm">累计收益</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-2xl font-bold text-yellow-600">¥{((stats?.pending_commission || 0)).toFixed(2)}</div>
            <div className="text-gray-600 text-sm">待结算佣金</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-blue-600">¥{((stats?.paid_commission || 0)).toFixed(2)}</div>
            <div className="text-gray-600 text-sm">已结算佣金</div>
          </div>
        </div>

        {/* Promotion Links */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-primary">我的推广链接</h2>
            <button
              onClick={generateNewLink}
              disabled={newLinkLoading}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {newLinkLoading ? '生成中...' : '+ 生成新链接'}
            </button>
          </div>

          {links.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">🔗</div>
              <p>暂无推广链接，点击上方按钮生成</p>
            </div>
          ) : (
            <div className="space-y-4">
              {links.map(link => (
                <div key={link.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium text-primary">{link.code}</span>
                      <span className="text-gray-400 text-sm ml-2">
                        {new Date(link.created_at).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <button
                      onClick={() => copyLink(link.url)}
                      className="text-primary hover:underline text-sm"
                    >
                      复制链接
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 mb-3 break-all bg-gray-50 p-2 rounded">
                    {link.url}
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-500">
                      👆 点击 {link.clicks} 次
                    </span>
                    <span className="text-gray-500">
                      📦 {link.orders} 笔订单
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-primary mb-6">最近订单</h2>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📦</div>
              <p>暂无订单数据，继续推广获取收益！</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-600 text-sm border-b">
                    <th className="pb-3">订单号</th>
                    <th className="pb-3">套餐</th>
                    <th className="pb-3">金额</th>
                    <th className="pb-3">佣金</th>
                    <th className="pb-3">时间</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id} className="border-b border-gray-100">
                      <td className="py-3 text-sm text-gray-600">{order.id.slice(0, 8)}...</td>
                      <td className="py-3">{tierNames[order.tier_name] || order.tier_name}</td>
                      <td className="py-3">¥{order.amount}</td>
                      <td className="py-3 text-green-600">¥{order.commission.toFixed(2)}</td>
                      <td className="py-3 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('zh-CN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Commission Info */}
        <div className="mt-8 bg-primary/5 rounded-xl p-6">
          <h3 className="font-semibold text-primary mb-3">💡 佣金说明</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• 佣金比例：{(stats?.commission_rate * 100 || 10).toFixed(0)}%（由平台设定）</li>
            <li>• 佣金 = 订单金额 × 佣金比例 × (1 - 15%平台服务费)</li>
            <li>• 订单确认后，佣金进入待结算状态</li>
            <li>• 每月1日结算上月佣金，支付至您登记的收款方式</li>
            <li>• 如需调整佣金比例，请联系平台运营</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
