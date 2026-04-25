'use client'

import Link from 'next/link'

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Cancel Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">⏸️</span>
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">支付已取消</h1>
          <p className="text-gray-600">您取消了支付流程，您的订单暂未完成</p>
        </div>

        {/* Info Card */}
        <div className="card mb-6 text-left">
          <h2 className="text-lg font-semibold text-primary mb-4">温馨提示</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>您的订单已保留，您可以在方便时继续完成支付</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>所有套餐价格以官网最新公布为准</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>支付过程中有任何问题，欢迎联系客服</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/checkout" className="btn-primary block text-center w-full py-3">
            重新选择套餐
          </Link>
          <Link href="/" className="btn-secondary block text-center w-full py-3">
            返回首页
          </Link>
        </div>

        {/* Contact */}
        <p className="text-center text-xs text-gray-400 mt-6">
          客服热线：400-123-4567
        </p>
      </div>
    </div>
  )
}
