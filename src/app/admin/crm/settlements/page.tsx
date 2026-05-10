'use client'

import { useState, useEffect } from 'react'

interface Blogger {
  id: string
  douyin_id: string
  name: string
  status: 'active' | 'inactive' | 'pending' | 'rejected'
}

interface Settlement {
  id: string
  blogger_id: string
  blogger_name?: string
  period: string
  total_orders: number
  total_sales: number
  commission_rate: number
  commission_amount: number
  platform_fee: number
  net_amount: number
  status: 'pending' | 'approved' | 'paid' | 'rejected'
  bank_name?: string
  bank_account?: string
  remark?: string
  created_at: string
  paid_at?: string
}

const STATUS_NAMES: Record<string, { label: string; color: string }> = {
  'pending': { label: '待确认', color: 'bg-yellow-100 text-yellow-700' },
  'approved': { label: '已确认', color: 'bg-blue-100 text-blue-700' },
  'paid': { label: '已打款', color: 'bg-green-100 text-green-700' },
  'rejected': { label: '已驳回', color: 'bg-red-100 text-red-700' },
}

const PERIOD_PRESETS = [
  { label: '本月', value: () => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`
  }},
  { label: '上月', value: () => {
    const now = new Date()
    const last = new Date(now.getFullYear(), now.getMonth()-1, 1)
    return `${last.getFullYear()}-${String(last.getMonth()+1).padStart(2,'0')}`
  }},
]

export default function SettlementsAdminPage() {
  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [bloggers, setBloggers] = useState<Blogger[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bloggerFilter, setBloggerFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState<Settlement | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [action, setAction] = useState<'' | 'approve' | 'reject' | 'pay'>('')

  const [formData, setFormData] = useState({
    blogger_id: '',
    period: '',
    total_orders: 0,
    total_sales: 0,
    commission_rate: 10,
    remark: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [settRes, bloggersRes] = await Promise.all([
        fetch('/api/crm/settlements'),
        fetch('/api/crm/bloggers'),
      ])
      const settData = await settRes.json()
      const bloggersData = await bloggersRes.json()
      
      const bloggerMap: Record<string, string> = {}
      ;(bloggersData.data || []).forEach((b: Blogger) => {
        bloggerMap[b.id] = b.name || b.douyin_id
      })
      
      const settWithName = (settData.data || []).map((s: Settlement) => ({
        ...s,
        blogger_name: bloggerMap[s.blogger_id] || s.blogger_id,
      }))
      
      setSettlements(settWithName)
      setBloggers(bloggersData.data || [])
    } catch {
      setError('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setActionLoading(true)
    try {
      const res = await fetch('/api/crm/settlements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        setShowAddModal(false)
        setFormData({ blogger_id: '', period: '', total_orders: 0, total_sales: 0, commission_rate: 10, remark: '' })
        fetchData()
      } else {
        alert(data.error || '创建失败')
      }
    } finally {
      setActionLoading(false)
    }
  }

  async function handleBatchAction(actionType: 'approve' | 'reject' | 'pay') {
    if (selectedIds.size === 0) return
    const labels = { approve: '确认', reject: '驳回', pay: '标记已打款' }
    if (!confirm(`确定${labels[actionType]}选中的 ${selectedIds.size} 条结算？`)) return
    
    setActionLoading(true)
    try {
      await fetch('/api/crm/settlements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: actionType,
          ids: Array.from(selectedIds),
          remark: formData.remark,
        }),
      })
      setSelectedIds(new Set())
      setAction('')
      fetchData()
    } finally {
      setActionLoading(false)
    }
  }

  const filteredSettlements = settlements.filter(s => {
    if (bloggerFilter && s.blogger_id !== bloggerFilter) return false
    if (statusFilter && s.status !== statusFilter) return false
    return true
  })

  const totalPending = filteredSettlements
    .filter(s => s.status === 'pending' || s.status === 'approved')
    .reduce((sum, s) => sum + s.net_amount, 0)
  const totalPaid = filteredSettlements
    .filter(s => s.status === 'paid')
    .reduce((sum, s) => sum + s.net_amount, 0)
  const totalCount = filteredSettlements.length

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
          <h1 className="text-2xl font-bold text-gray-900">佣金结算管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理博主佣金结算，审核并确认打款</p>
        </div>
        <button
          onClick={() => {
            const now = new Date()
            const currentPeriod = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`
            setFormData(f => ({ ...f, period: currentPeriod }))
            setShowAddModal(true)
          }}
          className="px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-[#2D4A7C] transition text-sm"
        >
          + 新建结算单
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-[#1A365D]">{totalCount}</div>
          <div className="text-sm text-gray-500">结算单总数</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-yellow-600">¥{totalPending.toLocaleString()}</div>
          <div className="text-sm text-gray-500">待打款金额</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">¥{totalPaid.toLocaleString()}</div>
          <div className="text-sm text-gray-500">已打款金额</div>
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
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">全部状态</option>
            <option value="pending">待确认</option>
            <option value="approved">已确认</option>
            <option value="paid">已打款</option>
            <option value="rejected">已驳回</option>
          </select>
          <div className="flex items-center gap-2 ml-auto">
            {selectedIds.size > 0 && (
              <>
                <button
                  onClick={() => setAction('approve')}
                  className="px-3 py-2 text-blue-600 border border-blue-300 rounded-lg text-sm hover:bg-blue-50"
                >
                  批量确认
                </button>
                <button
                  onClick={() => setAction('reject')}
                  className="px-3 py-2 text-red-600 border border-red-300 rounded-lg text-sm hover:bg-red-50"
                >
                  批量驳回
                </button>
                <button
                  onClick={() => setAction('pay')}
                  className="px-3 py-2 text-green-600 border border-green-300 rounded-lg text-sm hover:bg-green-50"
                >
                  标记已打款
                </button>
              </>
            )}
            <div className="text-sm text-gray-500 ml-2">
              共 {filteredSettlements.length} 条
            </div>
          </div>
        </div>

        {/* Batch action confirm bar */}
        {action && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg flex items-center gap-3">
            <span className="text-sm text-gray-700">
              确定要对选中的 {selectedIds.size} 条结算单执行批量{action === 'approve' ? '确认' : action === 'reject' ? '驳回' : '打款'}吗？
            </span>
            <input
              type="text"
              placeholder="备注（可选）"
              value={formData.remark}
              onChange={e => setFormData(f => ({ ...f, remark: e.target.value }))}
              className="flex-1 px-3 py-1 border rounded text-sm"
            />
            <button
              onClick={() => handleBatchAction(action)}
              disabled={actionLoading}
              className="px-4 py-1 bg-[#1A365D] text-white rounded text-sm hover:bg-[#2D4A7C] disabled:opacity-50"
            >
              {actionLoading ? '处理中...' : '确定'}
            </button>
            <button
              onClick={() => { setAction(''); setFormData(f => ({ ...f, remark: '' })) }}
              className="px-4 py-1 text-gray-600 border rounded text-sm hover:bg-gray-100"
            >
              取消
            </button>
          </div>
        )}
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
                      setSelectedIds(new Set(filteredSettlements.map(s => s.id)))
                    } else {
                      setSelectedIds(new Set())
                    }
                  }}
                  checked={filteredSettlements.length > 0 && selectedIds.size === filteredSettlements.length}
                />
              </th>
              <th className="px-4 py-3 text-left text-gray-600">结算周期</th>
              <th className="px-4 py-3 text-left text-gray-600">博主</th>
              <th className="px-4 py-3 text-right text-gray-600">订单数</th>
              <th className="px-4 py-3 text-right text-gray-600">销售额</th>
              <th className="px-4 py-3 text-right text-gray-600">佣金率</th>
              <th className="px-4 py-3 text-right text-gray-600">佣金</th>
              <th className="px-4 py-3 text-right text-gray-600">平台费</th>
              <th className="px-4 py-3 text-right text-gray-600">实付金额</th>
              <th className="px-4 py-3 text-center text-gray-600">状态</th>
              <th className="px-4 py-3 text-center text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredSettlements.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-gray-400">
                  暂无结算记录
                </td>
              </tr>
            ) : filteredSettlements.map(s => {
              const statusInfo = STATUS_NAMES[s.status] || { label: s.status, color: 'bg-gray-100 text-gray-600' }
              return (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(s.id)}
                      onChange={e => {
                        const next = new Set(selectedIds)
                        if (e.target.checked) next.add(s.id)
                        else next.delete(s.id)
                        setSelectedIds(next)
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{s.period}</td>
                  <td className="px-4 py-3 text-gray-900">{s.blogger_name || s.blogger_id}</td>
                  <td className="px-4 py-3 text-right">{s.total_orders}</td>
                  <td className="px-4 py-3 text-right">¥{s.total_sales.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{s.commission_rate}%</td>
                  <td className="px-4 py-3 text-right text-[#C9A84C]">¥{s.commission_amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-red-500">¥{s.platform_fee.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-medium">¥{s.net_amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setShowDetailModal(s)}
                      className="text-[#1A365D] hover:underline text-xs"
                    >
                      详情
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[480px]">
            <h2 className="text-lg font-bold text-gray-900 mb-4">新建结算单</h2>
            <form onSubmit={handleCreate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">博主 *</label>
                  <select
                    required
                    value={formData.blogger_id}
                    onChange={e => setFormData({ ...formData, blogger_id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="">请选择博主</option>
                    {bloggers.map(b => (
                      <option key={b.id} value={b.id}>{b.name || b.douyin_id}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">结算周期 *</label>
                  <div className="flex gap-2">
                    <input
                      type="month"
                      required
                      value={formData.period}
                      onChange={e => setFormData({ ...formData, period: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    />
                    {PERIOD_PRESETS.map(p => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setFormData({ ...formData, period: p.value() })}
                        className="px-3 py-2 text-xs border rounded hover:bg-gray-50"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">订单数</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.total_orders}
                      onChange={e => setFormData({ ...formData, total_orders: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">销售额 (¥)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.total_sales}
                      onChange={e => setFormData({ ...formData, total_sales: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">佣金率 ({formData.commission_rate}%)</label>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="1"
                    value={formData.commission_rate}
                    onChange={e => setFormData({ ...formData, commission_rate: Number(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>5%</span><span>20%</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">佣金金额：</span>
                    <span className="text-[#C9A84C] font-medium">¥{(formData.total_sales * formData.commission_rate / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">平台费(15%)：</span>
                    <span className="text-red-500">-¥{(formData.total_sales * formData.commission_rate / 100 * 0.15).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-1 mt-1">
                    <span>实付金额：</span>
                    <span className="text-green-600">¥{(formData.total_sales * formData.commission_rate / 100 * 0.85).toFixed(2)}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                  <textarea
                    value={formData.remark}
                    onChange={e => setFormData({ ...formData, remark: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    rows={2}
                    placeholder="可选备注信息"
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
                  {actionLoading ? '创建中...' : '创建结算单'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[520px]">
            <h2 className="text-lg font-bold text-gray-900 mb-4">结算详情</h2>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-400">博主</div>
                  <div className="font-medium">{showDetailModal.blogger_name || showDetailModal.blogger_id}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">结算周期</div>
                  <div className="font-mono">{showDetailModal.period}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-400">状态</div>
                  <span className={`inline-block px-2 py-1 rounded text-xs ${
                    STATUS_NAMES[showDetailModal.status]?.color || 'bg-gray-100'
                  }`}>
                    {STATUS_NAMES[showDetailModal.status]?.label || showDetailModal.status}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-gray-400">创建时间</div>
                  <div>{new Date(showDetailModal.created_at).toLocaleDateString('zh-CN')}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-400">订单数</div>
                  <div className="font-medium">{showDetailModal.total_orders}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">销售额</div>
                  <div className="font-medium">¥{showDetailModal.total_sales.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">佣金率</div>
                  <div className="font-medium">{showDetailModal.commission_rate}%</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">佣金金额</span>
                  <span>¥{showDetailModal.commission_amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-red-500">
                  <span>平台费 (15%)</span>
                  <span>-¥{showDetailModal.platform_fee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>实付金额</span>
                  <span className="text-green-600">¥{showDetailModal.net_amount.toLocaleString()}</span>
                </div>
              </div>
              {showDetailModal.bank_name && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-400">开户行</div>
                    <div>{showDetailModal.bank_name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">银行账号</div>
                    <div className="font-mono">{showDetailModal.bank_account}</div>
                  </div>
                </div>
              )}
              {showDetailModal.remark && (
                <div>
                  <div className="text-xs text-gray-400">备注</div>
                  <div className="text-gray-600">{showDetailModal.remark}</div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              {showDetailModal.status === 'pending' && (
                <>
                  <button
                    onClick={async () => {
                      await fetch('/api/crm/settlements', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'reject', ids: [showDetailModal.id] }),
                      })
                      setShowDetailModal(null)
                      fetchData()
                    }}
                    className="px-4 py-2 text-red-600 border border-red-300 rounded-lg text-sm hover:bg-red-50"
                  >
                    驳回
                  </button>
                  <button
                    onClick={async () => {
                      await fetch('/api/crm/settlements', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'approve', ids: [showDetailModal.id] }),
                      })
                      setShowDetailModal(null)
                      fetchData()
                    }}
                    className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg text-sm hover:bg-blue-50"
                  >
                    确认
                  </button>
                </>
              )}
              {showDetailModal.status === 'approved' && (
                <button
                  onClick={async () => {
                    await fetch('/api/crm/settlements', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ action: 'pay', ids: [showDetailModal.id] }),
                    })
                    setShowDetailModal(null)
                    fetchData()
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                >
                  确认已打款
                </button>
              )}
              <button
                onClick={() => setShowDetailModal(null)}
                className="px-4 py-2 text-gray-600 border rounded-lg text-sm hover:bg-gray-50"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
