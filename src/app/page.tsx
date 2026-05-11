'use client'

import Link from 'next/link'
import { useState } from 'react'
import { PRICING_TIERS } from '@/lib/config'

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">💝</span>
            </div>
            <span className="text-xl font-bold text-primary">爱的延续</span>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <a href="#document-types" className="text-gray-600 hover:text-primary transition">文书类型</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-primary transition">如何使用</a>
            <a href="#pricing" className="text-gray-600 hover:text-primary transition">价格方案</a>
            <a href="#testimonials" className="text-gray-600 hover:text-primary transition">用户评价</a>
            <Link href="/auth" className="text-primary hover:text-primary/80 transition font-medium">登录/注册</Link>
          </nav>
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="菜单"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4">
            <nav className="flex flex-col gap-3">
              <a href="#document-types" className="text-gray-600 hover:text-primary transition py-2" onClick={() => setMobileMenuOpen(false)}>文书类型</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-primary transition py-2" onClick={() => setMobileMenuOpen(false)}>如何使用</a>
              <a href="#pricing" className="text-gray-600 hover:text-primary transition py-2" onClick={() => setMobileMenuOpen(false)}>价格方案</a>
              <a href="#testimonials" className="text-gray-600 hover:text-primary transition py-2" onClick={() => setMobileMenuOpen(false)}>用户评价</a>
              <Link href="/auth" className="text-primary hover:text-primary/80 transition font-medium py-2 border-t border-gray-100 mt-2" onClick={() => setMobileMenuOpen(false)}>登录/注册</Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex items-center pt-20 pb-16 md:pt-24 md:pb-20">
        <div className="max-w-6xl mx-auto px-4 w-full">
          {/* Trust badges top */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10 animate-fade-in">
            {[
              { icon: '🔒', text: 'AES-256加密' },
              { icon: '🛡️', text: '信息安全认证' },
              { icon: '⚖️', text: '专业律师审核' },
              { icon: '📱', text: '移动端适配' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <span className="text-lg">{badge.icon}</span>
                <span className="text-sm font-medium text-primary">{badge.text}</span>
              </div>
            ))}
          </div>

          {/* Main hero content */}
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              已有 12,847 个家庭选择信赖
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight">
              为挚爱，<br className="md:hidden" />
              <span className="text-gradient">提前做好</span>人生规划
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              从相濡以沫到儿孙满堂，每个重要时刻都值得认真对待<br />
              <strong className="text-primary">9类高频文书</strong>，AI智能引导，<strong className="text-primary">30分钟</strong>守护您的爱与责任
            </p>
          </div>

          {/* Life stage cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            {[
              { emoji: '💍', title: '步入婚姻', desc: '明确财产归属', sub: '婚前协议', color: 'bg-rose-50 border-rose-200 hover:border-rose-400' },
              { emoji: '🏠', title: '共同生活', desc: '约定财产管理', sub: '婚内约定', color: 'bg-blue-50 border-blue-200 hover:border-blue-400' },
              { emoji: '👶', title: '迎接新生', desc: '明确抚养安排', sub: '抚养协议', color: 'bg-amber-50 border-amber-200 hover:border-amber-400' },
              { emoji: '🧓', title: '安享晚年', desc: '传承与照护', sub: '遗赠协议', color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400' },
            ].map((stage, i) => (
              <a
                key={i}
                href="#document-types"
                className={`${stage.color} border-2 rounded-2xl p-5 text-center hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer group`}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{stage.emoji}</div>
                <h3 className="font-bold text-primary text-lg mb-1">{stage.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{stage.desc}</p>
                <span className="text-xs font-medium text-accent bg-white/60 px-2 py-1 rounded-full">{stage.sub}</span>
              </a>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a href="#document-types" className="btn-primary text-lg px-10 py-4 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40">
              立即规划 · 3分钟开始
            </a>
            <a href="#pricing" className="btn-secondary text-lg px-10 py-4">
              了解价格方案
            </a>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">12,847+</div>
              <div className="text-xs md:text-sm text-gray-500">用户信赖</div>
            </div>
            <div className="text-center border-x border-gray-200">
              <div className="text-2xl md:text-3xl font-bold text-primary">9</div>
              <div className="text-xs md:text-sm text-gray-500">文书类型</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">24h</div>
              <div className="text-xs md:text-sm text-gray-500">专业审核</div>
            </div>
          </div>
        </div>
      </section>

      {/* Document Types Section */}
      <section id="document-types" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4">
            覆盖家庭全生命周期的专业文书
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            从恋爱到终老，9类高频文书一站搞定<br />
            选择您的需求，AI引导您完成专属方案
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Row 1: Core lifecycle */}
            <Link href="/questionnaire?type=prenup" className="card hover:border-accent transition cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition">
                  <span className="text-2xl">💍</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary mb-1">婚前协议</h3>
                  <p className="text-sm text-gray-600 mb-2">明确婚前财产归属，避免婚后纠纷</p>
                  <span className="text-xs text-accent font-medium">热恋/结婚前</span>
                </div>
              </div>
            </Link>

            <Link href="/questionnaire?type=marital" className="card hover:border-accent transition cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition">
                  <span className="text-2xl">🏠</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary mb-1">婚内财产约定</h3>
                  <p className="text-sm text-gray-600 mb-2">婚姻中约定房产、存款、股权归属</p>
                  <span className="text-xs text-accent font-medium">已婚人群刚需</span>
                </div>
              </div>
            </Link>

            <Link href="/questionnaire?type=donation" className="card hover:border-accent transition cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition">
                  <span className="text-2xl">🎁</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary mb-1">财产赠与协议</h3>
                  <p className="text-sm text-gray-600 mb-2">恋爱/婚姻中对房产、车辆等大额财产的赠与，含附条件赠与</p>
                  <span className="text-xs text-accent font-medium">恋爱/婚姻中</span>
                </div>
              </div>
            </Link>

            {/* Row 2 */}
            <Link href="/questionnaire?type=custody" className="card hover:border-accent transition cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition">
                  <span className="text-2xl">👶</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary mb-1">抚养权/抚养费协议</h3>
                  <p className="text-sm text-gray-600 mb-2">离婚后孩子的抚养权归属、探视规则、抚养费标准及支付方式</p>
                  <span className="text-xs text-accent font-medium">离婚配套刚需</span>
                </div>
              </div>
            </Link>

            <Link href="/questionnaire?type=divorce" className="card hover:border-accent transition cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary mb-1">离婚协议</h3>
                  <p className="text-sm text-gray-600 mb-2">离婚条件、财产分割、子女安排</p>
                  <span className="text-xs text-gray-500">协议离婚必备</span>
                </div>
              </div>
            </Link>

            <Link href="/questionnaire?type=division" className="card hover:border-accent transition cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition">
                  <span className="text-2xl">🏢</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary mb-1">分家析产协议</h3>
                  <p className="text-sm text-gray-600 mb-2">家庭内部对房产、宅基地、家庭企业等财产的分割</p>
                  <span className="text-xs text-accent font-medium">家族财产规划</span>
                </div>
              </div>
            </Link>

            {/* Row 3 */}
            <Link href="/questionnaire?type=estate" className="card hover:border-accent transition cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition">
                  <span className="text-2xl">🧓</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary mb-1">遗赠扶养协议</h3>
                  <p className="text-sm text-gray-600 mb-2">约定由亲属/外人赡养，百年后财产赠与对方，比一般安排更具约束力</p>
                  <span className="text-xs text-accent font-medium">中老年刚需</span>
                </div>
              </div>
            </Link>

            <Link href="/questionnaire?type=guardianship" className="card hover:border-accent transition cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition">
                  <span className="text-2xl">🛡️</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary mb-1">意定监护协议</h3>
                  <p className="text-sm text-gray-600 mb-2">指定自己丧失民事行为能力时的监护人，负责财产管理、医疗决策</p>
                  <span className="text-xs text-accent font-medium">新刚需场景</span>
                </div>
              </div>
            </Link>

            <Link href="/questionnaire?type=will" className="card hover:border-accent transition cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition">
                  <span className="text-2xl">📜</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary mb-1">财产传承安排</h3>
                  <p className="text-sm text-gray-600 mb-2">安排身后财产传承，确保家人无忧</p>
                  <span className="text-xs text-gray-500">人生终极规划</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center mt-10">
            <a href="#document-types" className="btn-primary text-lg px-8 py-4">
              查看文书类型
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4">
            为什么选择我们
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            专业、温暖、便捷，让爱延续
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">AI智能问卷</h3>
              <p className="text-gray-600">选类型、填信息，AI引导您完成专属文书</p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚖️</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">专业团队审核</h3>
              <p className="text-gray-600">专业团队全程审核，确保文书效力，让您无后顾之忧</p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">安全加密</h3>
              <p className="text-gray-600">银行级加密存储，您的信息绝对安全，可随时修改</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              选择适合您的方案
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              超12,847个家庭已为至爱做出妥善安排，您也可以
            </p>
          </div>

          {/* Social proof strip */}
          <div className="flex items-center justify-center gap-6 mb-10 text-sm text-gray-500">
            <span className="flex items-center gap-1">⭐⭐⭐⭐⭐ <span className="text-primary font-medium">4.9/5</span> 评分</span>
            <span>•</span>
            <span>30天无理由退款</span>
            <span>•</span>
            <span>1对1客服支持</span>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`pricing-card relative ${tier.recommended ? 'pricing-card-recommended scale-[1.03]' : ''}`}
              >
                {tier.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-medium z-10">
                    ⭐ 最受欢迎
                  </div>
                )}
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-primary">{tier.name}</h3>
                  {tier.tagline && (
                    <p className="text-sm text-gray-500 mt-1">{tier.tagline}</p>
                  )}
                </div>
                <p className="text-gray-600 text-center mb-4 text-sm">{tier.description}</p>
                <div className="text-center mb-6">
                  {tier.originalPrice && (
                    <span className="text-gray-400 line-through text-lg mr-2">¥{tier.originalPrice}</span>
                  )}
                  <span className="text-4xl font-bold text-primary">¥{tier.price}</span>
                  <span className="text-gray-500">/次</span>
                  {tier.originalPrice && (
                    <div className="text-xs text-green-600 mt-1">
                      节省 ¥{tier.originalPrice - tier.price}
                    </div>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-accent mt-1">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/auth?redirect=/checkout&tier=${tier.id}`}
                  className={`block text-center py-3 rounded-lg font-medium transition ${
                    tier.recommended
                      ? 'bg-accent text-white hover:opacity-90'
                      : 'bg-primary text-white hover:opacity-90'
                  }`}
                >
                  {tier.cta || '立即选择'}
                </Link>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span className="text-lg">🔒</span>
              <span>AES-256加密</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span className="text-lg">🛡️</span>
              <span>信息安全认证</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span className="text-lg">⚖️</span>
              <span>专家审核</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span className="text-lg">📱</span>
              <span>移动端适配</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 bg-cream/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">12,847</div>
              <div className="text-sm text-gray-500">用户信赖之选</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">99.2%</div>
              <div className="text-sm text-gray-500">用户满意度</div>
            </div>
            <div>
              <div className="text-3xl mb-1 flex items-center justify-center gap-1">
                <span className="text-primary">🔒</span>
                <span className="text-primary font-bold">AES-256</span>
              </div>
              <div className="text-sm text-gray-500">银行级数据加密</div>
            </div>
            <div>
              <div className="text-3xl mb-1 flex items-center justify-center gap-1">
                <span className="text-primary">🛡️</span>
                <span className="text-primary font-bold">ISO</span>
              </div>
              <div className="text-sm text-gray-500">信息安全认证</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            常见问题
          </h2>
          <div className="space-y-4">
            {[
              { q: '文书生成需要多长时间？', a: '通常3-5分钟即可完成。复杂场景（如有多处房产、多名继承人）可能需要10-15分钟。' },
              { q: '我可以修改生成的文书吗？', a: '可以。生成后可在线编辑，如需大幅调整可重新生成，所有操作记录保存30天。' },
              { q: '我的信息是否安全？', a: '采用AES-256银行级加密，所有数据传输使用HTTPS协议，我们承诺不会将您的信息泄露给任何第三方。' },
              { q: '专业团队审核包含什么服务？', a: '由资深规划师逐字审核文书内容，确保条款清晰、合法、有效，并提供一项修改服务。' },
              { q: '如何联系客服？', a: '可通过页面右下角聊天窗口联系我们，或发送邮件至 support@aiwill-planner.cn，工作时间内1小时内回复。' },
            ].map((item, i) => (
              <details key={i} className="group bg-white rounded-xl shadow-sm border border-gray-100">
                <summary className="flex items-center justify-between cursor-pointer p-5 font-medium text-primary hover:text-accent transition">
                  {item.q}
                  <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-5 text-gray-600">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            用户真实评价
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="testimonial-card">
              <p className="text-gray-700 mb-4">
                "一直想规划但觉得麻烦，这个平台让我30分钟就完成了。操作简单，AI问题很贴心，就像有人在引导我思考。"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  王
                </div>
                <div>
                  <p className="font-medium text-primary">王先生</p>
                  <p className="text-sm text-gray-500">北京 · 专家护航版</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="text-gray-700 mb-4">
                "担心安排不规范让家人产生矛盾。有了专业团队审核，心里踏实多了。给这个平台点赞！"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                  李
                </div>
                <div>
                  <p className="font-medium text-primary">李女士</p>
                  <p className="text-sm text-gray-500">上海 · 专家护航版</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="text-gray-700 mb-4">
                "给父母买的，操作太复杂他们不会用。还好有这个平台，我帮他们填写，全程有引导，很方便。"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  张
                </div>
                <div>
                  <p className="font-medium text-primary">张先生</p>
                  <p className="text-sm text-gray-500">深圳 · 专家护航版</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            不要再等待，现在就行动
          </h2>
          <p className="text-white/80 text-lg mb-8">
            用30分钟，为家人留下确定的爱
          </p>
          <a href="#document-types" className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-cream transition">
            查看文书类型
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary/90 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-white/70">
          <p>© 2024 爱的延续. 用爱守护家人</p>
          <p className="mt-2 text-sm">私密安全 · 专业合规 · 温暖守护</p>
        </div>
      </footer>
    </div>
  )
}
