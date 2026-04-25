'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  const [sessionData, setSessionData] = useState<any>(null)

  useEffect(() => {
    // Get session data from localStorage (set by checkout page)
    const data = localStorage.getItem('checkout_session')
    if (data) {
      setSessionData(JSON.parse(data))
    }
  }, [])

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
                {sessionData?.sessionId?.slice(-8) || 'N/A'}
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
              <span>如需律师审核服务，您的专属律师将在24小时内与您联系</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">3.</span>
              <span>您可以随时登录查看和管理您的人生规划文档</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/questionnaire" className="btn-primary block text-center w-full py-3">
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
