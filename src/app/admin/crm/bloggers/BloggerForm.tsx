'use client'

import { useState, useEffect } from 'react'

export interface BloggerFormData {
  douyin_id: string
  name: string
  avatar: string
  bio: string
  followers: string
  category: string
  commission_rate: string
  contact_wechat: string
  contact_phone: string
  contact_email: string
  fee_type: 'cps' | 'fixed' | 'hybrid'
  webhook_url: string
  webhook_type: 'feishu' | 'wecom' | 'none'
  note: string
}

export interface Blogger {
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
  note?: string
}

const CATEGORY_OPTIONS = ['情感', '婚姻', '家庭', '法律', '理财', '养老', '保险', '其他']

const DEFAULT_FORM_DATA: BloggerFormData = {
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
}

interface BloggerFormProps {
  blogger?: Blogger | null
  onSubmit: (data: BloggerFormData) => void
  onCancel: () => void
  actionLoading?: boolean
}

export default function BloggerForm({ blogger, onSubmit, onCancel, actionLoading = false }: BloggerFormProps) {
  const [formData, setFormData] = useState<BloggerFormData>(DEFAULT_FORM_DATA)

  useEffect(() => {
    if (blogger) {
      setFormData({
        douyin_id: blogger.douyin_id,
        name: blogger.name,
        avatar: blogger.avatar || '',
        bio: blogger.bio || '',
        followers: String(blogger.followers),
        category: blogger.category,
        commission_rate: String(blogger.commission_rate),
        contact_wechat: blogger.contact_wechat || '',
        contact_phone: blogger.contact_phone || '',
        contact_email: blogger.contact_email || '',
        fee_type: blogger.fee_type,
        webhook_url: blogger.webhook_url || '',
        webhook_type: blogger.webhook_type,
        note: blogger.note || '',
      })
    } else {
      setFormData(DEFAULT_FORM_DATA)
    }
  }, [blogger])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        {/* 抖音号 */}
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
            disabled={!!blogger}
            required
          />
        </div>

        {/* 博主名称 */}
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

        {/* 头像URL */}
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

        {/* 粉丝数 */}
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

        {/* 内容类别 */}
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

        {/* 佣金比例 */}
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

        {/* 微信 */}
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

        {/* 手机号 */}
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

        {/* 邮箱 */}
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

        {/* 合作方式 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">合作方式</label>
          <select
            value={formData.fee_type}
            onChange={e => setFormData({ ...formData, fee_type: e.target.value as BloggerFormData['fee_type'] })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
          >
            <option value="cps">CPS分润</option>
            <option value="fixed">固定费用</option>
            <option value="hybrid">混合模式</option>
          </select>
        </div>

        {/* Webhook类型 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Webhook类型</label>
          <select
            value={formData.webhook_type}
            onChange={e => setFormData({ ...formData, webhook_type: e.target.value as BloggerFormData['webhook_type'] })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
          >
            <option value="none">不使用</option>
            <option value="feishu">飞书</option>
            <option value="wecom">企业微信</option>
          </select>
        </div>

        {/* Webhook地址 - 全宽 */}
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

        {/* 简介 - 全宽 */}
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

        {/* 备注 - 全宽 */}
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

      {/* 按钮 */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
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
  )
}

export { CATEGORY_OPTIONS, DEFAULT_FORM_DATA }
