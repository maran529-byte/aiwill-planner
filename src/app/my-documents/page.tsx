'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DOCUMENT_TYPES } from '@/lib/config'

interface Document {
  id: string
  type: string
  title: string
  createdAt: string
  updatedAt: string
  status: 'draft' | 'completed'
}

export default function MyDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (!data.user) {
          router.push('/auth?redirect=/my-documents')
        }
        setLoading(false)
      })
      .catch(() => {
        router.push('/auth?redirect=/my-documents')
        setLoading(false)
      })
  }, [router])

  // 演示数据（后续接后端）
  useEffect(() => {
    // 模拟已创建的文书
    setDocuments([
      {
        id: '1',
        type: 'will',
        title: '遗嘱',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
        status: 'completed'
      }
    ])
  }, [])

  const getDocTypeName = (type: string) => {
    const doc = DOCUMENT_TYPES.find(d => d.id === type)
    return doc ? doc.name : type
  }

  const getDocTypeIcon = (type: string) => {
    const doc = DOCUMENT_TYPES.find(d => d.id === type)
    return doc?.icon || '📄'
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
            <Link href="/dashboard" className="text-gray-600 hover:text-primary transition">
              返回账户
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">我的规划</h1>
            <p className="text-gray-600">管理您已创建的文书</p>
          </div>
          <Link
            href="/#document-types"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
          >
            创建新文书
          </Link>
        </div>

        {documents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📋</span>
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">暂无文书</h2>
            <p className="text-gray-600 mb-6">开始创建您的第一份文书</p>
            <Link
              href="/#document-types"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
            >
              选择文书类型
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map(doc => (
              <div key={doc.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl">{getDocTypeIcon(doc.type)}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-primary">{doc.title}</h3>
                    <p className="text-sm text-gray-500">
                      {doc.status === 'completed' ? '已完成' : '草稿'}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  创建于 {doc.createdAt}
                </p>
                <Link
                  href={`/result?id=${doc.id}`}
                  className="inline-block bg-accent text-white px-4 py-2 rounded-lg hover:opacity-90 transition text-sm"
                >
                  查看详情
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
