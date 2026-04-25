'use client'

import Link from 'next/link'

export default function LawyerSuccessPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📅</span>
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">预约成功！</h1>
          <p className="text-gray-600">您的律师预约已确认，稍后律师将与您电话联系</p>
        </div>

        <div className="card mb-6 text-left">
          <h2 className="font-medium text-primary mb-3">温馨提示</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• 律师将在24小时内与您确认预约详情</li>
            <li>• 如需更改预约，请联系客服400-123-4567</li>
            <li>• 请保持手机畅通，以便律师及时联系您</li>
          </ul>
        </div>

        <Link href="/dashboard" className="btn-primary block text-center w-full py-3">
          返回个人中心
        </Link>
      </div>
    </div>
  )
}
