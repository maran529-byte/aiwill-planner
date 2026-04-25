'use client'

import Link from 'next/link'
import { PRICING_TIERS } from '@/lib/config'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xl">💝</span>
            </div>
            <span className="text-xl font-bold text-primary">爱的延续</span>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <a href="#document-types" className="text-gray-600 hover:text-primary transition">文书类型</a>
            <a href="#features" className="text-gray-600 hover:text-primary transition">功能介绍</a>
            <a href="#pricing" className="text-gray-600 hover:text-primary transition">价格方案</a>
            <a href="#testimonials" className="text-gray-600 hover:text-primary transition">用户评价</a>
            <Link href="/auth" className="text-primary hover:text-primary/80 transition font-medium">登录/注册</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-pattern py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight">
            家庭全生命周期的<br className="md:hidden" />
            财产与身份规划
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            从婚前协议到遗嘱，9类高频文书一站搞定。<br />
            AI智能引导，30分钟完成人生重要规划。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <select
              id="doc-type-select"
              className="btn-primary text-lg px-6 py-4 pr-10 appearance-none cursor-pointer min-w-[200px]"
              defaultValue=""
              onChange={(e) => {
                const val = (e.target as HTMLSelectElement).value;
                if (val) window.location.href = `/questionnaire?type=${val}`;
              }}
            >
              <option value="" disabled>选择文书类型</option>
              <option value="prenup">💍 婚前协议</option>
              <option value="marital">🏠 婚内财产约定</option>
              <option value="donation">🎁 财产赠与协议</option>
              <option value="custody">👶 抚养权/抚养费协议</option>
              <option value="divorce">📋 离婚协议</option>
              <option value="division">🏢 分家析产协议</option>
              <option value="estate">🧓 遗赠扶养协议</option>
              <option value="guardianship">🛡️ 意定监护协议</option>
              <option value="will">📜 遗嘱</option>
            </select>
            <a href="#pricing" className="btn-secondary text-lg px-8 py-4">
              了解价格
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-500">已有 12,847 位用户 · 9类文书类型 · 24h律师审核</p>
        </div>
      </section>

      {/* Document Types Section */}
      <section id="document-types" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4">
            覆盖家庭全生命周期的法律文书
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
                  <p className="text-sm text-gray-600 mb-2">约定由亲属/外人赡养，百年后财产赠与对方，比遗嘱更具约束力</p>
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
                  <h3 className="text-lg font-bold text-primary mb-1">遗嘱</h3>
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
              <h3 className="text-xl font-semibold text-primary mb-2">律师专业审核</h3>
              <p className="text-gray-600">合作律师全程审核，确保法律效力，让您无后顾之忧</p>
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
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4">
            选择适合您的方案
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            无论您需求如何，都能找到合适的解决方案
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`pricing-card ${tier.recommended ? 'pricing-card-recommended' : ''}`}
              >
                {tier.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-medium">
                    推荐方案
                  </div>
                )}
                <h3 className="text-2xl font-bold text-primary mb-2">{tier.name}</h3>
                <p className="text-gray-600 mb-4">{tier.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary">¥{tier.price}</span>
                  <span className="text-gray-500">/次</span>
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
                  立即选择
                </Link>
              </div>
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
                  <p className="text-sm text-gray-500">北京 · 律师护航版</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="text-gray-700 mb-4">
                "担心遗嘱写不规范让家人产生矛盾。有了律师审核，心里踏实多了。给这个平台点赞！"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                  李
                </div>
                <div>
                  <p className="font-medium text-primary">李女士</p>
                  <p className="text-sm text-gray-500">上海 · 律师护航版</p>
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
                  <p className="text-sm text-gray-500">深圳 · 律师护航版</p>
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
