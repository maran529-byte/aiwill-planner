'use client'

import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'

interface Blogger {
  id: string
  douyin_id: string
  name: string
  avatar?: string
  status: 'active' | 'inactive' | 'pending' | 'rejected'
}

interface PromotionLink {
  id: string
  blogger_id: string
  blogger_name?: string
  link_code: string
  target_url: string
  utm_source: string
  utm_medium: string
  utm_campaign: string
  plan_type: string
  clicks: number
  orders: number
  sales: number
  commission: number
  created_at: string
  expires_at?: string
}

const PLAN_NAMES: Record<string, string> = {
  'limited': '体验版',
  'ai-only': '专业版',
  'ai-lawyer': '尊享版',
  '': '全部',
}

export default function PromoLinksAdminPage() {
  const [links, setLinks] = useState<PromotionLink[]>([])
  const [bloggers, setBloggers] = useState<Blogger[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bloggerFilter, setBloggerFilter] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showAddModal, setShowAddModal] = useState(false)
  const [showCodeModal, setShowCodeModal] = useState<string>('')
  const [actionLoading, setActionLoading] = useState(false)

  const [formData, setFormData] = useState({
    blogger_id: '',
    target_url: 'https://aiwill-planner.cn/questionnaire',
    utm_source: 'douyin',
    utm_medium: 'affiliate',
    utm_campaign: '',
    plan_type: '',
    expires_at: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [linksRes, bloggersRes] = await Promise.all([
        fetch('/api/crm/promo-links'),
        fetch('/api/crm/bloggers'),
      ])
      const linksData = await linksRes.json()
      const bloggersData = await bloggersRes.json()
      
      const bloggerMap: Record<string, string> = {}
      ;(bloggersData.data || []).forEach((b: Blogger) => {
        bloggerMap[b.id] = b.name || b.douyin_id
      })
      
      const linksWithName = (linksData.data || []).map((l: PromotionLink) => ({
        ...l,
        blogger_name: bloggerMap[l.blogger_id] || l.blogger_id,
      }))
      
      setLinks(linksWithName)
      setBloggers(bloggersData.data || [])
    } catch (err) {
      setError('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateLink(e: React.FormEvent) {
    e.preventDefault()
    setActionLoading(true)
    try {
      const res = await fetch('/api/crm/promo-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        setShowAddModal(false)
        setFormData({
          blogger_id: '',
          target_url: 'https://aiwill-planner.cn/questionnaire',
          utm_source: 'douyin',
          utm_medium: 'affiliate',
          utm_campaign: '',
          plan_type: '',
          expires_at: '',
        })
        fetchData()
      } else {
        alert(data.error || '创建失败')
      }
    } catch {
      alert('创建失败')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleDelete(ids: string[]) {
    if (!confirm(`确定删除 ${ids.length} 条推广链接？`)) return
    setActionLoading(true)
    try {
      await fetch('/api/crm/promo-links', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      })
      setSelectedIds(new Set())
      fetchData()
    } finally {
      setActionLoading(false)
    }
  }

  const filteredLinks = links.filter(l => {
    if (bloggerFilter && l.blogger_id !== bloggerFilter) return false
    if (planFilter && l.plan_type !== planFilter) return false
    return true
  })

  const totalClicks = filteredLinks.reduce((s, l) => s + l.clicks, 0)
  const totalOrders = filteredLinks.reduce((s, l) => s + l.orders, 0)
  const totalSales = filteredLinks.reduce((s, l) => s + l.sales, 0)
  const totalCommission = filteredLinks.reduce((s, l) => s + l.commission, 0)

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('已复制到剪贴板')
    })
  }

  function getShareUrl(link: PromotionLink) {
    const base = `${link.target_url}?ref=${link.link_code}`
    if (link.utm_source) {
      return `${base}&utm_source=${link.utm_source}&utm_medium=${link.utm_medium}&utm_campaign=${link.utm_campaign}`
    }
    return base
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">推广链接管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理博主推广链接，追踪转化数据</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-[#2D4A7C] transition text-sm"
        >
          + 生成推广链接
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-[#1A365D]">{totalClicks.toLocaleString()}</div>
          <div className="text-sm text-gray-500">总点击</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-[#1A365D]">{totalOrders.toLocaleString()}</div>
          <div className="text-sm text-gray-500">总订单</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-[#C9A84C]">¥{totalSales.toLocaleString()}</div>
          <div className="text-sm text-gray-500">总销售额</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-[#C9A84C]">¥{totalCommission.toLocaleString()}</div>
          <div className="text-sm text-gray-500">总佣金</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center gap-4">
          <select
            value={bloggerFilter}
            onChange={e => setBloggerFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">全部博主</option>
            {bloggers.map(b => (
              <option key={b.id} value={b.id}>{b.name || b.douyin_id}</option>
            ))}
          </select>
          <select
            value={planFilter}
            onChange={e => setPlanFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">全部套餐</option>
            <option value="limited">体验版</option>
            <option value="ai-only">专业版</option>
            <option value="ai-lawyer">尊享版</option>
          </select>
          {selectedIds.size > 0 && (
            <button
              onClick={() => handleDelete(Array.from(selectedIds))}
              className="px-3 py-2 text-red-600 border border-red-300 rounded-lg text-sm hover:bg-red-50"
            >
              删除选中 ({selectedIds.size})
            </button>
          )}
          <div className="ml-auto text-sm text-gray-500">
            共 {filteredLinks.length} 条链接
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds(new Set(filteredLinks.map(l => l.id)))
                    } else {
                      setSelectedIds(new Set())
                    }
                  }}
                  checked={filteredLinks.length > 0 && selectedIds.size === filteredLinks.length}
                />
              </th>
              <th className="px-4 py-3 text-left text-gray-600">链接码</th>
              <th className="px-4 py-3 text-left text-gray-600">博主</th>
              <th className="px-4 py-3 text-left text-gray-600">推广目标</th>
              <th className="px-4 py-3 text-left text-gray-600">套餐</th>
              <th className="px-4 py-3 text-right text-gray-600">点击</th>
              <th className="px-4 py-3 text-right text-gray-600">订单</th>
              <th className="px-4 py-3 text-right text-gray-600">销售额</th>
              <th className="px-4 py-3 text-right text-gray-600">佣金</th>
              <th className="px-4 py-3 text-left text-gray-600">创建时间</th>
              <th className="px-4 py-3 text-center text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredLinks.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-gray-400">
                  暂无推广链接
                </td>
              </tr>
            ) : filteredLinks.map(link => (
              <tr key={link.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(link.id)}
                    onChange={e => {
                      const next = new Set(selectedIds)
                      if (e.target.checked) next.add(link.id)
                      else next.delete(link.id)
                      setSelectedIds(next)
                    }}
                  />
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {link.link_code}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-900">{link.blogger_name || link.blogger_id}</td>
                <td className="px-4 py-3 text-gray-500 text-xs max-w-[200px] truncate">{link.target_url}</td>
                <td className="px-4 py-3">
                  <span className="text-xs">
                    {PLAN_NAMES[link.plan_type] || link.plan_type || '-'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">{link.clicks.toLocaleString()}</td>
                <td className="px-4 py-3 text-right">{link.orders}</td>
                <td className="px-4 py-3 text-right">¥{link.sales.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-[#C9A84C] font-medium">¥{link.commission.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {new Date(link.created_at).toLocaleDateString('zh-CN')}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => setShowCodeModal(link.id)}
                    className="text-[#1A365D] hover:underline text-xs"
                  >
                    查看链接
                  </button>
                  <span className="mx-1">|</span>
                  <button
                    onClick={() => {
                      setSelectedIds(new Set([link.id]))
                      handleDelete([link.id])
                    }}
                    className="text-red-500 hover:underline text-xs"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[520px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4">生成推广链接</h2>
            <form onSubmit={handleCreateLink}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">选择博主 *</label>
                  <select
                    required
                    value={formData.blogger_id}
                    onChange={e => setFormData({ ...formData, blogger_id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="">请选择博主</option>
                    {bloggers.filter(b => b.status === 'active').map(b => (
                      <option key={b.id} value={b.id}>{b.name || b.douyin_id}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">目标URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.target_url}
                    onChange={e => setFormData({ ...formData, target_url: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="https://aiwill-planner.cn/questionnaire"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">utm_source</label>
                    <input
                      value={formData.utm_source}
                      onChange={e => setFormData({ ...formData, utm_source: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">utm_medium</label>
                    <input
                      value={formData.utm_medium}
                      onChange={e => setFormData({ ...formData, utm_medium: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">utm_campaign (博主标识)</label>
                  <input
                    value={formData.utm_campaign}
                    onChange={e => setFormData({ ...formData, utm_campaign: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="如博主抖音号"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">指定套餐</label>
                  <select
                    value={formData.plan_type}
                    onChange={e => setFormData({ ...formData, plan_type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="">不限</option>
                    <option value="limited">体验版</option>
                    <option value="ai-only">专业版</option>
                    <option value="ai-lawyer">尊享版</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">过期时间</label>
                  <input
                    type="date"
                    value={formData.expires_at}
                    onChange={e => setFormData({ ...formData, expires_at: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 border rounded-lg text-sm hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-[#1A365D] text-white rounded-lg text-sm hover:bg-[#2D4A7C] disabled:opacity-50"
                >
                  {actionLoading ? '生成中...' : '生成链接'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share URL Modal */}
      {showCodeModal && (
        (() => {
          const link = links.find(l => l.id === showCodeModal)
          if (!link) return null
          const shareUrl = getShareUrl(link)
          return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-[480px]">
                <h2 className="text-lg font-bold text-gray-900 mb-4">推广链接</h2>
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">推广码</div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-100 px-3 py-2 rounded font-mono text-sm">{link.link_code}</code>
                    <button
                      onClick={() => copyToClipboard(link.link_code)}
                      className="px-3 py-2 text-sm text-[#1A365D] border rounded hover:bg-gray-50"
                    >
                      复制
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">完整推广链接</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="flex-1 bg-gray-50 px-3 py-2 rounded text-xs font-mono border"
                    />
                    <button
                      onClick={() => copyToClipboard(shareUrl)}
                      className="px-3 py-2 text-sm text-[#1A365D] border rounded hover:bg-gray-50"
                    >
                      复制
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mb-4">
                  点击数据仅统计通过该链接的访问，订单和佣金需关联订单数据更新。
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowCodeModal('')}
                    className="px-4 py-2 bg-[#1A365D] text-white rounded-lg text-sm"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          )
        })()
      )}
    </div>
  )
}
