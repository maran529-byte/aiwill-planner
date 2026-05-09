'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { jsPDF } from 'jspdf'
import { PRICING_TIERS } from '@/lib/config'

interface GenerateResult {
  draft: string
  complexity: {
    score: number
    level: string
    description: string
  }
  suggestedTier: {
    tier: string
    name: string
  }
  lawyerProfile: {
    name: string
    title: string
    firm?: string
    experience?: string
    cases?: string
    rating?: number
    available: boolean
    nextAvailable?: string
  }
  generatedAt: string
  apiUsed?: boolean
}

const DOC_TYPE_NAMES: Record<string, string> = {
  will: '遗嘱',
  prenup: '婚前协议',
  marital: '婚内财产约定',
  divorce: '离婚协议',
  custody: '抚养权协议',
  guardianship: '意定监护',
  donation: '财产赠与',
  estate: '遗赠扶养',
  division: '分家析产',
}

export default function ResultPage({ searchParams }: { searchParams: { type?: string } }) {
  const docType = searchParams.type || 'will'
  const [result, setResult] = useState<GenerateResult | null>(null)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    preferredTime: '',
    notes: '',
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem(`${docType}_result`)
    if (saved) {
      try {
        setResult(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load result')
      }
    }
  }, [docType])

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Mock submission
    await new Promise((resolve) => setTimeout(resolve, 500))
    setFormSubmitted(true)
    setShowContactForm(false)
    alert('预约成功！我们将在24小时内与您联系')
  }

  const handleDownload = () => {
    if (!result) return

    const docTypeName = DOC_TYPE_NAMES[docType] || '规划文书'
    // Create PDF with proper Chinese font support
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(20)
    doc.text(docTypeName, 105, 20, { align: 'center' })

    // Add date
    doc.setFontSize(10)
    doc.text(`生成日期: ${new Date().toLocaleDateString('zh-CN')}`, 105, 28, { align: 'center' })

    // Add horizontal line
    doc.line(20, 32, 190, 32)

    // Add draft content with word wrap
    doc.setFontSize(11)
    const lines = doc.splitTextToSize(result.draft, 170)
    let yPos = 40

    lines.forEach((line: string) => {
      if (yPos > 280) {
        doc.addPage()
        yPos = 20
      }
      doc.text(line, 20, yPos)
      yPos += 6
    })

    // Add footer on last page
    doc.setFontSize(9)
    doc.setTextColor(128)
    doc.text(`本${DOC_TYPE_NAMES[docType] || '文书'}仅供参考，具体安排请咨询专业顾问。`, 105, 285, { align: 'center' })

    // Save the PDF
    doc.save(`${DOC_TYPE_NAMES[docType] || '规划文书'}_${new Date().toISOString().split('T')[0]}.pdf`)
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">正在加载结果...</p>
          <Link href="/questionnaire" className="text-primary hover:underline">
            重新填写问卷
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <span className="text-xl">💝</span>
            <span className="font-bold">爱的延续</span>
          </Link>
          <Link href="/questionnaire" className="text-sm text-gray-500 hover:text-primary">
            重新填写 →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl p-6 mb-8 text-center">
          <h1 className="text-xl md:text-2xl font-bold mb-2">🎉 您的{DOC_TYPE_NAMES[docType] || '规划文书'}已生成</h1>
          <p className="text-white/80">生成时间：{new Date(result.generatedAt).toLocaleString('zh-CN')}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Will Draft */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-primary/5 px-6 py-4 border-b">
                <h2 className="text-lg font-bold text-primary">📄 {DOC_TYPE_NAMES[docType] || '规划文书'}</h2>
              </div>
              <div className="p-6">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed">
                  {result.draft}
                </pre>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t flex gap-4">
                <button
                  onClick={handleDownload}
                  className="btn-primary flex items-center gap-2"
                >
                  📥 下载文书
                </button>
                <button className="btn-secondary flex items-center gap-2">
                  🖨️ 打印
                </button>
              </div>
            </div>

            {/* Complexity Assessment */}
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-primary mb-4">📊 复杂度评估</h3>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-yellow-400 flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold text-white">{result.complexity.score}</span>
                  </div>
                  <span className="text-sm text-gray-500">复杂度评分</span>
                </div>
                <div>
                  <p className="text-xl font-bold text-primary">{result.complexity.level}</p>
                  <p className="text-gray-600">{result.complexity.description}</p>
                  <p className="text-sm text-accent mt-2">
                    建议方案：{result.suggestedTier.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lawyer Profile */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-primary mb-4">👨‍💼 推荐专家</h3>
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                  👨‍💼
                </div>
                <h4 className="font-bold text-gray-800">{result.lawyerProfile.name}</h4>
                <p className="text-sm text-gray-500">{result.lawyerProfile.title}</p>
                {result.lawyerProfile.firm && (
                  <p className="text-sm text-gray-600 mt-1">{result.lawyerProfile.firm}</p>
                )}
                {result.lawyerProfile.experience && (
                  <p className="text-sm text-accent mt-2">✨ {result.lawyerProfile.experience}</p>
                )}
                {result.lawyerProfile.cases && (
                  <p className="text-sm text-gray-500">{result.lawyerProfile.cases}</p>
                )}
                {result.lawyerProfile.rating && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="text-sm text-gray-600">{result.lawyerProfile.rating}</span>
                  </div>
                )}
                <div className="mt-4">
                  {result.lawyerProfile.available ? (
                    <p className="text-sm text-green-600">🟢 可立即咨询</p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      下次可预约：{result.lawyerProfile.nextAvailable}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowContactForm(true)}
                className="w-full btn-primary mt-4"
              >
                预约专家咨询
              </button>
            </div>

            {/* Pricing Upgrade */}
            <div className="bg-gradient-to-br from-accent/10 to-transparent rounded-xl p-6 border border-accent/20">
              <h3 className="text-lg font-bold text-primary mb-2">升级服务</h3>
              <p className="text-sm text-gray-600 mb-4">
                根据您的复杂度评估，建议升级到更完善的服务套餐
              </p>
              {PRICING_TIERS.filter((t) => t.id !== 'ai-only').map((tier) => (
                <div
                  key={tier.id}
                  className="bg-white rounded-lg p-4 mb-3 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-primary">{tier.name}</h4>
                      <p className="text-xs text-gray-500">{tier.tagline}</p>
                    </div>
                    <span className="text-xl font-bold text-accent">¥{tier.price}</span>
                  </div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {tier.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <span className="text-green-500">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                  onClick={() => router.push(`/checkout?tier=${tier.id}`)}
                  className="w-full btn-secondary text-sm mt-3 py-2"
                >
                  选择此套餐
                </button>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <h4 className="font-bold text-yellow-800 mb-2">⚠️ 重要提示</h4>
              <p className="text-xs text-yellow-700">
                本草案为AI生成，仅供参考，不构成专业意见。为确保安排妥当，请预约专业团队进行审核，或前往公证机构办理公证手续。
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-primary mb-4">预约专家咨询</h3>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  您的姓名
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="input-field"
                  placeholder="请输入姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  手机号码
                </label>
                <input
                  type="tel"
                  required
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="input-field"
                  placeholder="请输入手机号码"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  偏好时间
                </label>
                <select
                  value={contactForm.preferredTime}
                  onChange={(e) => setContactForm({ ...contactForm, preferredTime: e.target.value })}
                  className="input-field"
                >
                  <option value="">请选择</option>
                  <option value="工作日">工作日</option>
                  <option value="周末">周末</option>
                  <option value="均可">均可</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  备注
                </label>
                <textarea
                  value={contactForm.notes}
                  onChange={(e) => setContactForm({ ...contactForm, notes: e.target.value })}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="如有特殊需求请在此说明"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 btn-secondary"
                >
                  取消
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  提交预约
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-primary text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-white/70 text-sm">
            © 2024 爱的延续 · AI人生规划平台 · 守护您和家人的未来
          </p>
        </div>
      </footer>
    </div>
  )
}