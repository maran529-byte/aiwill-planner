'use client'

import Link from 'next/link'

export default function LawyerPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-primary transition">
            ← 返回
          </Link>
          <span className="text-xl font-bold text-primary">专家预约</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Coming Soon */}
        <div className="card text-center py-16">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold text-primary mb-2">专家预约功能</h2>
          <p className="text-gray-500 mb-6">即将上线，敬请期待</p>
          <Link href="/dashboard" className="btn-primary inline-block">
            返回首页
          </Link>
        </div>
      </main>
    </div>
  )
}
