'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Blogger {
  id: string
  douyin_id: string
  name: string
  avatar?: string
  bio?: string
  followers: number
  category: string
  status: 'active' | 'inactive' | 'pending' | 'rejected'
  commission_rate: number
  contact_wechat?: string
  contact_phone?: string
  contact_email?: string
  fee_type: 'cps' | 'fixed' | 'hybrid'
  webhook_url?: string
  webhook_type: 'feishu' | 'wecom' | 'none'
  total_orders: number
  total_sales: number
  total_commission: number
  created_at: string
  updated_at: string
}

const STATUS_NAMES: Record<string, string> = {
  active: '合作中',
  inactive: '已暂停',
  pending: '待审核',
  rejected: '已拒绝',
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-600',
  pending: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800',
}

const CATEGORY_OPTIONS = ['情感', '婚姻', '家庭', '法律', '理财', '养老', '保险', '其他']

export default function BloggersAdminPage() {
  const [bloggers, setBloggers] = useState<Blogger[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBlogger, setEditingBlogger] = useState<Blogger | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // 表单状态
  const [formData, setFormData] = useState({
    douyin_id: '',
    name: '',
    avatar: '',
    bio: '',
    followers: '',
    category: '',
    commission_rate: '10',
    contact_wechat: '',
    contact_phone: '',
    contact_email: '',
    fee_type: 'cps' as const,
    webhook_url: '',
    webhook_type: 'none' as const,
    note: '',
  })

  const fetchBloggers = async () => {
    setLoading(true)
    try {
      const url = statusFilter ? `/api/blogger?status=${statusFilter}` : '/api/blogger'
      const res = await fetch(url)
      const json = await res.json()
      if (json.success) {
        setBloggers(json.data || [])
      } else {
        setError(json.error || '获取失败')
      }
    } catch (err) {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBloggers()
  }, [statusFilter])

  const handleSelectAll = () => {
    if (selectedIds.size === filteredBloggers.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredBloggers.map(b => b.id)))
    }
  }

  const handleSelect = (id: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedIds(newSet)
  }

  const handleBatchAction = async (action: 'activate' | 'deactivate') => {
    if (selectedIds.size === 0) return
    setActionLoading(true)
    try {
      const res = await fetch('/api/blogger', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds), action }),
      })
      const json = await res.json()
      if (json.success) {
        setSelectedIds(new Set())
        fetchBloggers()
      } else {
        alert(json.error || '操作失败')
      }
    } catch (err) {
      alert('网络错误')
    } finally {
      setActionLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      douyin_id: '',
      name: '',
      avatar: '',
      bio: '',
      followers: '',
      category: '',
      commission_rate: '10',
      contact_wechat: '',
      contact_phone: '',
      contact_email: '',
      fee_type: 'cps',
      webhook_url: '',
      webhook_type: 'none',
      note: '',
    })
    setEditingBlogger(null)
  }

  const openAddModal = () => {
    resetForm()
    setShowAddModal(true)
  }

  const openEditModal = (blogger: Blogger) => {
    setFormData({
      douyin_id: blogger.douyin_id,
      name: blogger.name,
      avatar: blogger.avatar || '',
      bio: blogger.bio || '',
      followers: String(blogger.followers),
      category: blogger.category,
      commission_rate: String(Number(blogger.commission_rate) * 100),
      contact_wechat: blogger.contact_wechat || '',
      contact_phone: blogger.contact_phone || '',
      contact_email: blogger.contact_email || '',
      fee_type: blogger.fee_type,
      webhook_url: blogger.webhook_url || '',
      webhook_type: blogger.webhook_type,
      note: blogger.note || '',
    })
    setEditingBlogger(blogger)
    setShowAddModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.douyin_id || !formData.name || !formData.category) {
      alert('请填写必填项')
      return
    }

    setActionLoading(true)
    try {
      const payload = {
        ...formData,
        followers: Number(formData.followers) || 0,
        commission_rate: Number(formData.commission_rate) / 100,
      }

      let res
      if (editingBlogger) {
        res = await fetch(`/api/blogger/${editingBlogger.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch('/api/blogger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      const json = await res.json()
      if (json.success) {
        setShowAddModal(false)
        resetForm()
        fetchBloggers()
      } else {
        alert(json.error || '保存失败')
      }
    } catch (err) {
      alert('网络错误')
    } finally {
      setActionLoading(false)
    }
  }

  const filteredBloggers = bloggers.filter(b => {
    if (!searchKeyword) return true
    const kw = searchKeyword.toLowerCase()
    return (
      b.name.toLowerCase().includes(kw) ||
      b.douyin_id.toLowerCase().includes(kw) ||
      b.category.toLowerCase().includes(kw)
    )
  })

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xl">💝</span>
              </div>
              <span className="text-xl font-bold text-primary">爱的延续</span>
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">博主CRM管理</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/blogger" className="text-primary hover:underline text-sm">
              博主推广后台
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary mb-1">博主管理</h1>
            <p className="text-gray-600 text-sm">管理抖音情感博主合作、推广链接和佣金结算</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2"
          >
            <span>+ 新增博主</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">状态筛选：</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
            >
              <option value="">全部</option>
              <option value="active">合作中</option>
              <option value="inactive">已暂停</option>
              <option value="pending">待审核</option>
              <option value="rejected">已拒绝</option>
            </select>
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <label className="text-sm text-gray-600">关键词搜索：</label>
            <input
              type="text"
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              placeholder="搜索博主名称/抖音号/类别"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">已选 {selectedIds.size} 项</span>
              <button
                onClick={() => handleBatchAction('activate')}
                disabled={actionLoading}
                className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:opacity-90 disabled:opacity-50"
              >
                批量启用
              </button>
              <button
                onClick={() => handleBatchAction('deactivate')}
                disabled={actionLoading}
                className="bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm hover:opacity-90 disabled:opacity-50"
              >
                批量停用
              </button>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-2xl font-bold text-primary">{bloggers.length}</div>
            <div className="text-gray-600 text-sm">博主总数</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-2xl font-bold text-green-600">
              {bloggers.filter(b => b.status === 'active').length}
            </div>
            <div className="text-gray-600 text-sm">合作中</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {bloggers.filter(b => b.status === 'pending').length}
            </div>
            <div className="text-gray-600 text-sm">待审核</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-2xl font-bold text-blue-600">
              ¥{bloggers.reduce((sum, b) => sum + b.total_commission, 0).toFixed(0)}
            </div>
            <div className="text-gray-600 text-sm">累计佣金</div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">加载中...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : filteredBloggers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-4">📋</div>
              <p>暂无博主数据</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === filteredBloggers.length && filteredBloggers.length > 0}
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm text-gray-600 font-medium">博主信息</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-600 font-medium">抖音号</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-600 font-medium">类别</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-600 font-medium">状态</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-600 font-medium">佣金比例</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-600 font-medium">订单/销售额</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-600 font-medium">累计佣金</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-600 font-medium">联系方式</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-600 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBloggers.map(blogger => (
                    <tr key={blogger.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(blogger.id)}
                          onChange={() => handleSelect(blogger.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                            {blogger.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-primary">{blogger.name}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(blogger.created_at).toLocaleDateString('zh-CN')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{blogger.douyin_id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{blogger.category}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[blogger.status]}`}>
                          {STATUS_NAMES[blogger.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {(Number(blogger.commission_rate) * 100).toFixed(0)}%
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-700">{blogger.total_orders} 笔</div>
                        <div className="text-xs text-gray-500">¥{blogger.total_sales.toFixed(0)}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-green-600 font-medium">
                        ¥{blogger.total_commission.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {blogger.contact_wechat && <div>微: {blogger.contact_wechat}</div>}
                        {blogger.contact_phone && <div>电: {blogger.contact_phone}</div>}
                        {blogger.contact_email && <div className="text-xs truncate max-w-[120px]">{blogger.contact_email}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openEditModal(blogger)}
                          className="text-primary hover:underline text-sm mr-2"
                        >
                          编辑
                        </button>
                        <Link
                          href={`/dashboard/blogger?blogger_id=${blogger.douyin_id}`}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          查看
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-primary">
                {editingBlogger ? '编辑博主' : '新增博主'}
              </h2>
              <button
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    抖音号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.douyin_id}
                    onChange={e => setFormData({ ...formData, douyin_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                    placeholder="例如: love_story_2024"
                    disabled={!!editingBlogger}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    博主名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                    placeholder="输入博主名称"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">头像URL</label>
                  <input
                    type="text"
                    value={formData.avatar}
                    onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    粉丝数 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.followers}
                    onChange={e => setFormData({ ...formData, followers: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                    placeholder="例如: 50000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    内容类别 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                    required
                  >
                    <option value="">选择类别</option>
                    {CATEGORY_OPTIONS.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">佣金比例 (%)</label>
                  <input
                    type="number"
                    value={formData.commission_rate}
                    onChange={e => setFormData({ ...formData, commission_rate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                    placeholder="5-20之间"
                    min="5"
                    max="20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">微信</label>
                  <input
                    type="text"
                    value={formData.contact_wechat}
                    onChange={e => setFormData({ ...formData, contact_wechat: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                    placeholder="微信号"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
                  <input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={e => setFormData({ ...formData, contact_phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                    placeholder="手机号码"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">合作方式</label>
                  <select
                    value={formData.fee_type}
                    onChange={e => setFormData({ ...formData, fee_type: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  >
                    <option value="cps">CPS分润</option>
                    <option value="fixed">固定费用</option>
                    <option value="hybrid">混合模式</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Webhook类型</label>
                  <select
                    value={formData.webhook_type}
                    onChange={e => setFormData({ ...formData, webhook_type: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  >
                    <option value="none">不使用</option>
                    <option value="feishu">飞书</option>
                    <option value="wecom">企业微信</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Webhook地址</label>
                  <input
                    type="url"
                    value={formData.webhook_url}
                    onChange={e => setFormData({ ...formData, webhook_url: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                    placeholder="https://..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">简介</label>
                  <textarea
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                    rows={2}
                    placeholder="博主简介..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                  <textarea
                    value={formData.note}
                    onChange={e => setFormData({ ...formData, note: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                    rows={2}
                    placeholder="备注信息..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                  {actionLoading ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
