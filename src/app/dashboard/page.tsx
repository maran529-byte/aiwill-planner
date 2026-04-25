'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        } else {
          router.push('/auth')
        }
        setLoading(false)
      })
      .catch(() => {
        router.push('/auth')
        setLoading(false)
      })
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth')
  }

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
            <span className="text-gray-600">
              {user?.name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-500 transition text-sm"
            >
              退出
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">我的账户</h1>
        <p className="text-gray-600 mb-8">欢迎回来，{user?.name || user?.email}</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Continue Questionnaire */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">继续问卷</h2>
            <p className="text-gray-600 mb-4">您有未完成的遗嘱问卷，继续填写或重新开始。</p>
            <Link
              href="/questionnaire"
              className="inline-block bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              继续填写
            </Link>
          </div>

          {/* My Wills */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">我的遗嘱</h2>
            <p className="text-gray-600 mb-4">查看和管理您已完成的遗嘱文档。</p>
            <Link
              href="/result"
              className="inline-block bg-accent text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              查看遗嘱
            </Link>
          </div>

          {/* Lawyer Appointment */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">⚖️</span>
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">律师预约</h2>
            <p className="text-gray-600 mb-4">预约专业律师进行一对一审核服务。</p>
            <Link
              href="/lawyer"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              立即预约
            </Link>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">💳</span>
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">支付记录</h2>
            <p className="text-gray-600 mb-4">查看您的购买记录和订阅信息。</p>
            <button
                onClick={() => router.push('/checkout')}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                查看记录
              </button>
          </div>
        </div>
      </main>
    </div>
  )
}
