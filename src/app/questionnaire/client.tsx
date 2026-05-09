'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState, useMemo, useEffect } from 'react'
import { DocumentType, getQuestionnaireByType, shouldSkipQuestion } from '@/lib/questionnaire'

const STORAGE_KEYS: Record<DocumentType, string> = {
  prenup: 'prenup_questionnaire_answers',
  marital: 'marital_questionnaire_answers',
  divorce: 'divorce_questionnaire_answers',
  custody: 'custody_questionnaire_answers',
  guardianship: 'guardianship_questionnaire_answers',
  donation: 'donation_questionnaire_answers',
  estate: 'estate_questionnaire_answers',
  will: 'will_questionnaire_answers',
  division: 'division_questionnaire_answers',
}

const QUESTIONNAIRE_SUBMIT_COUNT_KEY = 'questionnaire_submit_count'
const QUESTIONNAIRE_SUBMIT_LIMIT = 30
const ATTRIBUTION_KEY = 'questionnaire_attribution'

const RESULT_PATHS: Record<DocumentType, string> = {
  prenup: '/result?type=prenup',
  marital: '/result?type=marital',
  divorce: '/result?type=divorce',
  custody: '/result?type=custody',
  guardianship: '/result?type=guardianship',
  donation: '/result?type=donation',
  estate: '/result?type=estate',
  will: '/result?type=will',
  division: '/result?type=division',
}

const API_PATHS: Record<DocumentType, string> = {
  prenup: '/api/generate',
  marital: '/api/generate',
  divorce: '/api/generate',
  custody: '/api/generate',
  guardianship: '/api/generate',
  donation: '/api/generate',
  estate: '/api/generate',
  will: '/api/generate',
  division: '/api/generate',
}

function getDocumentType(param: string | null): DocumentType {
  const validTypes: DocumentType[] = ['prenup', 'marital', 'divorce', 'custody', 'guardianship', 'donation', 'estate', 'will', 'division']
  if (param && validTypes.includes(param as DocumentType)) {
    return param as DocumentType
  }
  return 'will'
}

function QuestionnaireContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const docType = getDocumentType(searchParams.get('type'))

  const [currentModuleIdx, setCurrentModuleIdx] = useState(0)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitCount, setSubmitCount] = useState(0)
  const [orderClaimId, setOrderClaimId] = useState('')
  const [showOrderClaim, setShowOrderClaim] = useState(false)

  const submitRemaining = Math.max(0, QUESTIONNAIRE_SUBMIT_LIMIT - submitCount)
  const isSubmitDisabled = submitCount >= QUESTIONNAIRE_SUBMIT_LIMIT

  const { modules, questions, title, subtitle } = useMemo(
    () => getQuestionnaireByType(docType),
    [docType]
  )

  const currentModuleQuestions = useMemo(() => {
    return questions.filter(q => q.moduleId === modules[currentModuleIdx]?.id)
  }, [questions, modules, currentModuleIdx])

  const visibleQuestions = useMemo(() => {
    return currentModuleQuestions.filter(q => !shouldSkipQuestion(q, answers))
  }, [currentModuleQuestions, answers])

  const effectiveQuestionIdx = Math.min(currentQuestionIdx, Math.max(0, visibleQuestions.length - 1))
  const currentQuestion = visibleQuestions[effectiveQuestionIdx]

  const totalQuestions = visibleQuestions.length
  const currentQNum = effectiveQuestionIdx + 1

  const allVisibleQuestions = questions.filter(q => !shouldSkipQuestion(q, answers))
  const answeredCount = Object.keys(answers).filter(k => answers[k] !== '' && answers[k] !== undefined).length
  const totalProgress = allVisibleQuestions.length > 0 ? Math.min(100, Math.round((answeredCount / allVisibleQuestions.length) * 100)) : 0

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS[docType])
    if (saved) {
      try {
        setAnswers(JSON.parse(saved))
      } catch {}
    }
    const savedCount = localStorage.getItem(QUESTIONNAIRE_SUBMIT_COUNT_KEY)
    if (savedCount) {
      try {
        setSubmitCount(parseInt(savedCount, 10) || 0)
      } catch {}
    }
    // Capture and persist attribution params (source, ref, plan) from URL
    const source = searchParams.get('source')
    const ref = searchParams.get('ref')
    const plan = searchParams.get('plan')
    const savedAttr = localStorage.getItem(ATTRIBUTION_KEY)
    if (!savedAttr && (source || ref || plan)) {
      localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify({ source, ref, plan }))
    } else if (savedAttr) {
      try {
        const attr = JSON.parse(savedAttr)
        if (!attr.source && source) attr.source = source
        if (!attr.ref && ref) attr.ref = ref
        if (!attr.plan && plan) attr.plan = plan
        localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attr))
      } catch {}
    }
  }, [docType, searchParams])

  const handleAnswer = (value: any) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value }
    setAnswers(newAnswers)
    localStorage.setItem(STORAGE_KEYS[docType], JSON.stringify(newAnswers))
  }

  const handleNext = () => {
    if (effectiveQuestionIdx < visibleQuestions.length - 1) {
      setCurrentQuestionIdx(effectiveQuestionIdx + 1)
    } else if (currentModuleIdx < modules.length - 1) {
      setCurrentModuleIdx(currentModuleIdx + 1)
      setCurrentQuestionIdx(0)
    }
  }

  const handlePrev = () => {
    if (effectiveQuestionIdx > 0) {
      setCurrentQuestionIdx(effectiveQuestionIdx - 1)
    } else if (currentModuleIdx > 0) {
      setCurrentModuleIdx(currentModuleIdx - 1)
      const prevModuleQs = questions.filter(q => q.moduleId === modules[currentModuleIdx - 1]?.id && !shouldSkipQuestion(q, answers))
      setCurrentQuestionIdx(Math.max(0, prevModuleQs.length - 1))
    }
  }

  const handleSubmit = async () => {
    if (isSubmitDisabled) return
    const newCount = submitCount + 1
    localStorage.setItem(QUESTIONNAIRE_SUBMIT_COUNT_KEY, String(newCount))
    setSubmitCount(newCount)
    setIsSubmitting(true)
    // Retrieve persisted attribution data
    let attribution: Record<string, string> = {}
    try {
      const raw = localStorage.getItem(ATTRIBUTION_KEY)
      if (raw) attribution = JSON.parse(raw)
    } catch {}
    try {
      const res = await fetch(API_PATHS[docType], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, docType, attribution, orderClaimId }),
      })
      if (res.ok) {
        const data = await res.json()
        localStorage.setItem(`${docType}_result`, JSON.stringify(data))
        localStorage.removeItem(STORAGE_KEYS[docType])
        localStorage.removeItem(ATTRIBUTION_KEY)
        router.push(RESULT_PATHS[docType])
      }
    } catch {
      localStorage.removeItem(STORAGE_KEYS[docType])
      localStorage.removeItem(ATTRIBUTION_KEY)
      router.push(RESULT_PATHS[docType])
    }
  }

  const isLastQuestion = effectiveQuestionIdx === visibleQuestions.length - 1 && currentModuleIdx === modules.length - 1

  const currentAnswer = currentQuestion ? (answers[currentQuestion.id] ?? '') : ''

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xl">💝</span>
            </div>
            <span className="text-xl font-bold text-primary">爱的延续</span>
          </div>
          <button
            onClick={() => router.push('/')}
            className="text-gray-500 hover:text-primary transition text-sm"
          >
            退出
          </button>
          {submitCount > 0 && (
            <span className="text-xs text-gray-400 ml-3">
              剩余 {submitRemaining} 次
            </span>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>当前模块：{modules[currentModuleIdx]?.name}</span>
            <span>{totalProgress}% 完成</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {modules.map((m, i) => (
            <button
              key={m.id}
              onClick={() => { setCurrentModuleIdx(i); setCurrentQuestionIdx(0) }}
              className={`px-3 py-1 rounded-full text-sm transition ${
                i === currentModuleIdx
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {currentQuestion && (
          <div className="card mb-6">
            <div className="mb-2">
              <span className="text-sm text-accent font-medium">
                第 {currentModuleIdx + 1}/{modules.length} 模块 · 第 {currentQNum}/{totalQuestions} 题
              </span>
            </div>
            <h2 className="text-xl font-bold text-primary mb-6">
              {currentQuestion.question}
              {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
            </h2>

            {currentQuestion.type === 'text' && (
              <input
                type="text"
                value={currentAnswer}
                onChange={e => handleAnswer(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            )}

            {currentQuestion.type === 'number' && (
              <input
                type="number"
                value={currentAnswer}
                onChange={e => handleAnswer(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            )}

            {currentQuestion.type === 'textarea' && (
              <textarea
                value={currentAnswer}
                onChange={e => handleAnswer(e.target.value)}
                placeholder={currentQuestion.placeholder}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            )}

            {(currentQuestion.type === 'radio' || currentQuestion.type === 'select') && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((opt, i) => (
                  <label
                    key={i}
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${
                      currentAnswer === opt
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={opt}
                      checked={currentAnswer === opt}
                      onChange={() => handleAnswer(opt)}
                      className="w-5 h-5 text-primary"
                    />
                    <span className="text-lg">{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === 'checkbox' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((opt, i) => {
                  const checked = Array.isArray(currentAnswer) && currentAnswer.includes(opt)
                  return (
                    <label
                      key={i}
                      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${
                        checked
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={opt}
                        checked={checked}
                        onChange={() => {
                          const arr = Array.isArray(currentAnswer) ? [...currentAnswer] : []
                          if (checked) {
                            handleAnswer(arr.filter(a => a !== opt))
                          } else {
                            handleAnswer([...arr, opt])
                          }
                        }}
                        className="w-5 h-5 text-primary rounded"
                      />
                      <span className="text-lg">{opt}</span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {isLastQuestion && (
          <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/30">
            <p className="text-sm text-accent font-medium mb-2">🎁 绑定博主订单号（选填）</p>
            <p className="text-xs text-gray-500 mb-3">如果博主给你发了订单号，在这里填写可绑定博主关系</p>
            <input
              type="text"
              value={orderClaimId}
              onChange={e => setOrderClaimId(e.target.value.toUpperCase())}
              placeholder="请输入订单号，如 AWM20250505"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              maxLength={20}
            />
          </div>
        )}

        <div className="flex justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentModuleIdx === 0 && effectiveQuestionIdx === 0}
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            上一步
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 rounded-lg bg-accent text-white font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {isSubmitting ? '生成中...' : '提交生成文书'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition"
            >
              下一步
            </button>
          )}
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          您的回答已自动保存，随时可以中断继续
        </p>
      </main>
    </div>
  )
}

export default function QuestionnaireClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💝</span>
          </div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    }>
      <QuestionnaireContent />
    </Suspense>
  )
}
