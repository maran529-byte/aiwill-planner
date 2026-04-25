import { NextRequest, NextResponse } from 'next/server'
import { MINIMAX_API_KEY, MINIMAX_BASE_URL, MINIMAX_MODEL } from '@/lib/config'

interface GenerateRequest {
  name?: string
  age?: number
  marital?: string
  children?: number
  property?: string
  propertyDesc?: string
  savings?: string
  stocks?: string
  insurance?: string
  vehicles?: string
  debts?: string
  heirType?: string
  heirDetails?: string
  spouseInherit?: string
  minorChild?: string
  heirConditions?: string
  guardian?: string
  guardianName?: string
  pets?: string
  petArrangement?: string
  digital?: string
  digitalAssets?: string
  educationFund?: string
  educationFundAmount?: string
  charity?: string
  charityDetails?: string
  otherConditions?: string
  existingWill?: string
  existingWillDetails?: string
  trust?: string
  trustDetails?: string
  familyConflict?: string
  complexAssets?: string
  overseasAssets?: string
}

function calculateComplexity(answers: GenerateRequest): number {
  let score = 0

  if (answers.age && answers.age > 60) score += 10
  if (answers.age && answers.age > 70) score += 10

  if (answers.marital === '已婚') score += 15
  if (answers.marital === '离异') score += 20

  if (answers.children && answers.children > 0) score += answers.children * 5
  if (answers.children && answers.children > 2) score += 10

  if (answers.property === '有') score += 15
  if (answers.savings && answers.savings.includes('100')) score += 10
  if (answers.stocks === '有') score += 15
  if (answers.insurance === '有') score += 10
  if (answers.vehicles === '有') score += 5
  if (answers.debts === '有') score += 15

  if (answers.heirType === '指定继承人') score += 20
  if (answers.heirType === '混合') score += 25
  if (answers.spouseInherit === '是') score += 10
  if (answers.minorChild === '是') score += 20
  if (answers.heirConditions) score += 15

  if (answers.guardian === '是') score += 25
  if (answers.pets === '有') score += 10
  if (answers.digital === '有') score += 10

  if (answers.educationFund === '是') score += 15
  if (answers.charity === '是') score += 20
  if (answers.otherConditions) score += 10

  if (answers.existingWill === '有') score += 15
  if (answers.trust === '有') score += 20
  if (answers.familyConflict === '是') score += 30
  if (answers.complexAssets === '是') score += 20
  if (answers.overseasAssets === '有') score += 25

  return Math.min(score, 100)
}

function getComplexityLevel(score: number) {
  if (score < 30) return { level: '简单', description: '资产清晰，继承人明确' }
  if (score < 60) return { level: '中等', description: '有一定复杂性，建议律师审核' }
  if (score < 80) return { level: '复杂', description: '涉及多方利益，需要专业指导' }
  return { level: '高度复杂', description: '强烈建议选择律师全程服务' }
}

function suggestTier(score: number) {
  if (score < 30) return { tier: 'ai-only', name: 'AI专属版' }
  if (score < 60) return { tier: 'ai-lawyer', name: '律师护航版' }
  return { tier: 'ai-lawyer', name: '律师护航版' }
}

function getMockLawyerProfile(tier: string) {
  const lawyers: Record<string, object> = {
    'ai-only': {
      name: '在线咨询',
      title: 'AI智能服务',
      description: '您可以使用AI服务自主完成遗嘱起草',
      available: true,
    },
    'ai-lawyer': {
      name: '张律师',
      title: '资深婚姻继承律师',
      firm: '北京正义律师事务所',
      experience: '15年执业经验',
      cases: '处理继承案件500+',
      rating: 4.9,
      available: true,
      nextAvailable: '明天 14:00',
    },
  }
  return lawyers[tier] || lawyers['ai-only']
}

function buildPrompt(answers: GenerateRequest): string {
  const parts: string[] = []

  if (answers.name) parts.push(`立遗嘱人姓名：${answers.name}`)
  if (answers.age) parts.push(`年龄：${answers.age}岁`)
  if (answers.marital) parts.push(`婚姻状况：${answers.marital}`)
  if (answers.children !== undefined) parts.push(`子女数量：${answers.children}人`)
  if (answers.property) parts.push(`房产：${answers.property}${answers.propertyDesc ? '（' + answers.propertyDesc + '）' : ''}`)
  if (answers.savings) parts.push(`存款：${answers.savings}`)
  if (answers.stocks) parts.push(`股票基金：${answers.stocks}`)
  if (answers.insurance) parts.push(`保险：${answers.insurance}`)
  if (answers.vehicles) parts.push(`车辆：${answers.vehicles}`)
  if (answers.debts) parts.push(`负债：${answers.debts}`)
  if (answers.heirType) parts.push(`继承方式：${answers.heirType}`)
  if (answers.heirDetails) parts.push(`继承人详情：${answers.heirDetails}`)
  if (answers.spouseInherit) parts.push(`配偶继承份额：${answers.spouseInherit}`)
  if (answers.minorChild) parts.push(`未成年子女：${answers.minorChild}`)
  if (answers.heirConditions) parts.push(`继承条件：${answers.heirConditions}`)
  if (answers.guardian) parts.push(`监护人指定：${answers.guardian === '是' ? '是，指定' + (answers.guardianName || '待填写') : '否'}`)
  if (answers.pets) parts.push(`宠物：${answers.pets}${answers.petArrangement ? '，安排：' + answers.petArrangement : ''}`)
  if (answers.digital) parts.push(`数字资产：${answers.digital}${answers.digitalAssets ? '，内容：' + answers.digitalAssets : ''}`)
  if (answers.educationFund) parts.push(`教育基金：${answers.educationFund}${answers.educationFundAmount ? '，金额：' + answers.educationFundAmount : ''}`)
  if (answers.charity) parts.push(`慈善捐赠：${answers.charity}${answers.charityDetails ? '，详情：' + answers.charityDetails : ''}`)
  if (answers.otherConditions) parts.push(`其他条件：${answers.otherConditions}`)
  if (answers.existingWill) parts.push(`现有遗嘱：${answers.existingWill}${answers.existingWillDetails ? '，详情：' + answers.existingWillDetails : ''}`)
  if (answers.trust) parts.push(`家族信托：${answers.trust}${answers.trustDetails ? '，详情：' + answers.trustDetails : ''}`)
  if (answers.familyConflict) parts.push(`家庭矛盾风险：${answers.familyConflict}`)
  if (answers.complexAssets) parts.push(`复杂资产：${answers.complexAssets}`)
  if (answers.overseasAssets) parts.push(`海外资产：${answers.overseasAssets}`)

  return parts.join('\n')
}

async function generateWithMiniMax(prompt: string): Promise<string> {
  if (!MINIMAX_API_KEY) {
    throw new Error('MINIMAX_API_KEY not configured')
  }

  const response = await fetch(`${MINIMAX_BASE_URL}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MINIMAX_API_KEY}`,
      'x-api-key': MINIMAX_API_KEY,
    },
    body: JSON.stringify({
      model: MINIMAX_MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: 'system',
          content: `你是一位专业的中国继承法律师。请根据用户提供的遗嘱规划信息，生成一份专业、严谨的遗嘱草案。

要求：
1. 严格遵循《中华人民共和国民法典》继承编相关规定
2. 语言正式、规范，体现法律文件的严肃性
3. 结构清晰，涵盖：前言、财产状况、继承人安排、特殊安排、遗赠条件、附则等
4. 对复杂情况给出专业建议
5. 末尾注明"本遗嘱仅供参考，实际法律效力需经公证机构公证或律师审核确认"
6. 用中文回复，使用中文标点符号`
        },
        {
          role: 'user',
          content: `请根据以下信息生成遗嘱草案：

${prompt}

如果信息不足以生成完整遗嘱，请在相应部分注明"待补充"，但仍要提供完整的遗嘱框架。`
        }
      ],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`MiniMax API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || data.message?.content || ''
}

export async function POST(request: NextRequest) {
  try {
    const answers: GenerateRequest = await request.json()

    const complexityScore = calculateComplexity(answers)
    const complexityLevel = getComplexityLevel(complexityScore)
    const suggestedTier = suggestTier(complexityScore)

    let willDraft: string

    if (MINIMAX_API_KEY && MINIMAX_API_KEY !== '***') {
      const prompt = buildPrompt(answers)
      willDraft = await generateWithMiniMax(prompt)
    } else {
      // Fallback to mock when no API key
      const name = answers.name || '先生/女士'
      const age = answers.age || 'XX'

      willDraft = `# 遗嘱草案

立遗嘱人：${name}
年龄：${age}岁

## 第一条 前言

本人意识清醒、精神状态良好，具有完全民事行为能力。现依据《中华人民共和国民法典》及相关法律规定，制定本遗嘱，对本人合法财产作出如下安排。

## 第二条 财产状况

### 2.1 房产
${answers.property === '有' ? `本人拥有房产，具体情况如下：${answers.propertyDesc || '详见附件'}` : '本人名下无房产或房产已做其他安排。'}

### 2.2 存款及金融资产
${answers.savings ? `本人存款及金融资产情况：${answers.savings}` : '本人存款情况详见附件。'}

### 2.3 其他财产
- 股票基金：${answers.stocks === '有' ? '有，具体情况详见附件' : '无'}
- 保险：${answers.insurance === '有' ? '有，具体情况详见附件' : '无'}
- 车辆：${answers.vehicles === '有' ? '有，具体情况详见附件' : '无'}
- 数字资产：${answers.digital === '有' ? `有，${answers.digitalAssets || '详见附件'}` : '无'}

### 2.4 负债情况
${answers.debts === '有' ? '本人存在一定负债，请在继承时予以考虑，具体情况详见附件。' : '本人无负债或负债已清偿完毕。'}

## 第三条 继承人安排

### 3.1 继承方式
${answers.heirType || '法定继承'}

### 3.2 具体分配
${answers.heirDetails || '按照法律规定执行'}

${answers.spouseInherit === '是' ? '### 3.3 配偶份额\n本人配偶依法享有相应的继承份额，具体比例按照法律规定执行。' : ''}

${answers.minorChild === '是' ? '### 3.4 未成年子女\n对于未成年的子女，已作出特别安排，确保其权益得到保障。' : ''}

${answers.heirConditions ? `### 3.5 继承条件\n${answers.heirConditions}` : ''}

## 第四条 特殊安排

${answers.guardian === '是' ? `### 4.1 监护人指定\n如本人配偶无法继续抚养子女，指定${answers.guardianName || 'XXX'}为子女的监护人。` : ''}

${answers.pets === '有' ? `### 4.2 宠物安排\n${answers.petArrangement || '宠物由家人照顾'}。` : ''}

## 第五条 教育基金

${answers.educationFund === '是' ? `本人决定设立教育基金，金额为${answers.educationFundAmount || '人民币XX万元'}，用于子女教育。` : '未设立专项教育基金。'}

## 第六条 慈善捐赠

${answers.charity === '是' ? `本人愿意将部分财产用于慈善事业：${answers.charityDetails || '详见附件'}。` : '未安排慈善捐赠。'}

${answers.otherConditions ? `## 第七条 其他条件\n${answers.otherConditions}` : ''}

## 第八条 附则

${answers.existingWill === '有' ? `本遗嘱为最新版本，此前如有遗嘱，以本遗嘱为准。\n此前遗嘱情况：${answers.existingWillDetails || ''}` : ''}

${answers.trust === '有' ? `关于家族信托：${answers.trustDetails || '详见附件'}` : ''}

---

**声明**：本遗嘱草案仅供参考，实际法律效力需经公证机构公证或律师审核确认。

立遗嘱人：___________
日期：___________`
    }

    const lawyerProfile = getMockLawyerProfile(suggestedTier.tier)

    return NextResponse.json({
      success: true,
      willDraft,
      complexity: {
        score: complexityScore,
        level: complexityLevel.level,
        description: complexityLevel.description,
      },
      suggestedTier: suggestedTier,
      lawyerProfile,
      generatedAt: new Date().toISOString(),
      apiUsed: MINIMAX_API_KEY && MINIMAX_API_KEY !== '***',
    })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '生成失败，请重试' },
      { status: 500 }
    )
  }
}
