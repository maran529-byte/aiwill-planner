'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

function DouyinLandingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const source = searchParams.get('source')
  const ref = searchParams.get('ref')
  const plan = searchParams.get('plan')

  // 抖音独家优惠：直接减免
  const discountNote = source === 'douyin' ? '🎁 抖音粉丝专属：立减50元' : ''

  const handleStart = () => {
    const docType = searchParams.get('type') || 'will'
    const query = new URLSearchParams()
    query.set('type', docType)
    if (source) query.set('source', source)
    if (ref) query.set('ref', ref)
    if (plan) query.set('plan', plan)
    router.push(`/questionnaire?${query.toString()}`)
  }

  const bloggerName = ref || '抖音粉丝'

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-cream">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xl">💝</span>
            </div>
            <span className="text-xl font-bold text-primary">爱的延续</span>
          </div>
          <span className="text-sm text-gray-500">AI人生规划平台</span>
        </div>
      </header>

      {/* 抖音专属Banner */}
      <section className="bg-primary py-6">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-white/90 text-lg">来自 @{bloggerName} 的推荐</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">
            遗嘱，不是告别，是爱的延续
          </h1>
          <p className="text-white/80 mt-2">
            从婚前协议到遗嘱，9类文书守护家庭全生命周期
          </p>
        </div>
      </section>

      {/* 主CTA区 */}
      <section className="py-12 px-4">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">📜</div>
            <h2 className="text-2xl font-bold text-primary mb-2">
              30分钟，为家人留下确定的爱
            </h2>
            <p className="text-gray-600 mb-6">
              AI智能引导，专业律师审核，让您的每一份心意<br />
              都变成具有法律效力的文书
            </p>

            {discountNote && (
              <div className="bg-accent/10 text-accent font-medium px-4 py-2 rounded-lg mb-6">
                {discountNote}
              </div>
            )}

            <button
              onClick={handleStart}
              className="w-full bg-primary text-white text-lg font-bold py-4 rounded-xl hover:bg-primary/90 transition mb-4"
            >
              立即开始规划
            </button>

            <p className="text-sm text-gray-500">
              已有 12,847 位用户 · 9类文书类型 · 24h律师审核
            </p>
          </div>

          {/* 9大文书展示 */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-primary mb-4 text-center">
              覆盖家庭全生命周期的法律文书
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '💍', name: '婚前协议', stage: '热恋/结婚前' },
                { icon: '🏠', name: '婚内财产约定', stage: '已婚人群刚需' },
                { icon: '🎁', name: '财产赠与协议', stage: '恋爱/婚姻中' },
                { icon: '👶', name: '抚养权/抚养费协议', stage: '离婚配套刚需' },
                { icon: '📋', name: '离婚协议', stage: '协议离婚必备' },
                { icon: '🏢', name: '分家析产协议', stage: '家族财产规划' },
                { icon: '🧓', name: '遗赠扶养协议', stage: '中老年刚需' },
                { icon: '🛡️', name: '意定监护协议', stage: '新刚需场景' },
                { icon: '📜', name: '遗嘱', stage: '人生终极规划' },
              ].map((doc) => (
                <div key={doc.name} className="flex flex-col items-center p-3 bg-cream rounded-xl">
                  <span className="text-2xl mb-1">{doc.icon}</span>
                  <span className="text-xs font-medium text-primary text-center">{doc.name}</span>
                  <span className="text-[10px] text-gray-500 text-center mt-0.5">{doc.stage}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 价格预览 */}
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-primary mb-4 text-center">价格方案</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-cream rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🤖</span>
                  <div>
                    <p className="font-medium text-primary">AI专属版</p>
                    <p className="text-xs text-gray-500">AI智能生成</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-primary">¥199</span>
                  {source === 'douyin' && <span className="ml-2 text-xs text-accent">券后¥149</span>}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl border-2 border-primary">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚖️</span>
                  <div>
                    <p className="font-medium text-primary">律师护航版</p>
                    <p className="text-xs text-gray-500">AI+24h律师审核</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-primary">¥699</span>
                  {source === 'douyin' && <span className="ml-2 text-xs text-accent">券后¥649</span>}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              {source === 'douyin' ? '🎁 限时优惠：通过本页下单享粉丝专属折扣' : ''}
            </p>
          </div>

          {/* 底部CTA */}
          <div className="mt-6 text-center">
            <button
              onClick={handleStart}
              className="w-full bg-accent text-white text-lg font-bold py-4 rounded-xl hover:opacity-90 transition"
            >
              开始我的规划 →
            </button>
            <p className="text-xs text-gray-400 mt-2">
              完全免费评估 · 满意后再付费
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary/90 py-6 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-white/70 text-sm">
          <p>爱的延续 · 用爱守护家人</p>
          <p className="mt-1">私密安全 · 专业合规 · 温暖守护</p>
        </div>
      </footer>
    </div>
  )
}

export default function DouyinLandingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    }>
      <DouyinLandingContent />
    </Suspense>
  )
}
