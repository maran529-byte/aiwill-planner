import { NextRequest, NextResponse } from 'next/server'
import { MINIMAX_API_KEY, MINIMAX_BASE_URL, MINIMAX_MODEL } from '@/lib/config'

// ============================================================
// 基础接口
// ============================================================

interface BaseGenerateRequest {
  docType: string
  attribution?: Record<string, string>
  orderClaimId?: string
}

// 婚前协议 (prenup)
interface PrenupRequest extends BaseGenerateRequest {
  partyA_name?: string
  partyA_age?: string
  partyA_id?: string
  partyB_name?: string
  partyB_age?: string
  partyB_id?: string
  partyA_property?: string
  partyA_savings?: string
  marital_income?: string
  house_purchase?: string
  car_ownership?: string
  investment_arrangement?: string
  debt_arrangement?: string
  prenup_date?: string
  effective_date?: string
  conditions?: string
  other_terms?: string
}

// 婚内财产约定 (marital)
interface MaritalRequest extends BaseGenerateRequest {
  partyA_name?: string
  partyA_age?: string
  partyA_id?: string
  partyB_name?: string
  partyB_id?: string
  house_1_owner?: string
  house_1_details?: string
  house_2_owner?: string
  house_2_details?: string
  savings_arrangement?: string
  savings_amount_range?: string
  future_income?: string
  account_arrangement?: string
  has_company?: string
  company_equity_owner?: string
  company_name?: string
  vehicle_owner?: string
  investment_owner?: string
  debt_arrangement?: string
  existing_debt?: string
  future_debt_rule?: string
  debt_emergency?: string
}

// 离婚协议 (divorce)
interface DivorceRequest extends BaseGenerateRequest {
  partyA_name?: string
  partyB_name?: string
  marriage_date?: string
  divorce_reason?: string
  voluntary?: string
  child_custody_arrangement?: string
  property_arrangement?: string
  child_count?: string
  child_1_custody?: string
  child_1_visit?: string
  child_1_support?: string
  child_1_support_amount?: string
  house_division?: string
  house_details?: string
  savings_division?: string
  vehicle_division?: string
  other_property?: string
  joint_debts?: string
  debt_details?: string
  debt_creditor?: string
  account_location?: string
  move_out_date?: string
  other_terms?: string
  custody_change?: string
  visit_weekend?: string
  visit_holiday?: string
  visit_summer?: string
}

// 抚养权 (custody)
interface CustodyRequest extends BaseGenerateRequest {
  father_name?: string
  mother_name?: string
  child_name?: string
  child_age?: string
  custody_holder?: string
  custody_change?: string
  custody_change_terms?: string
  living_arrangement?: string
  support_payer?: string
  support_amount?: string
  support_payment_method?: string
  support_account?: string
  visit_weekend?: string
  visit_holiday?: string
  visit_summer?: string
  medical_decision?: string
  education_decision?: string
  other_major?: string
}

// 意定监护 (guardianship)
interface GuardianshipRequest extends BaseGenerateRequest {
  name?: string
  age?: string
  id_card?: string
  address?: string
  guardian_1_name?: string
  guardian_1_relation?: string
  guardian_1_contact?: string
  guardian_2_backup?: string
  property_management?: string
  medical_decision?: string
  daily_decision?: string
  financial_limit?: string
  trigger_condition?: string
  hospital_level?: string
  disability_type?: string
  has_supervisor?: string
  supervisor_name?: string
  supervisor_duty?: string
}

// 财产赠与 (donation)
interface DonationRequest extends BaseGenerateRequest {
  donor_name?: string
  donor_id?: string
  donee_name?: string
  donee_id?: string
  property_type?: string
  property_house?: string
  property_vehicle?: string
  property_value?: string
  property_rights?: string
  has_conditions?: string
  condition_details?: string
  condition_failure?: string
  transfer_time?: string
  tax_bearing?: string
  related_property?: string
  revocation_conditions?: string
  revocation_period?: string
  dispute_resolution?: string
}

// 遗赠扶养 (estate)
interface EstateRequest extends BaseGenerateRequest {
  testator_name?: string
  testator_age?: string
  testator_health?: string
  testator_children?: string
  caregiver_name?: string
  caregiver_relation?: string
  caregiver_contact?: string
  has_house?: string
  house_details?: string
  has_savings?: string
  savings_amount?: string
  care_type?: string
  care_frequency?: string
  care_expense?: string
  medical_expense?: string
  testator_rights?: string
  caregiver_duties?: string
  property_after_death?: string
  breach_by_caregiver?: string
  breach_compensation?: string
  agreement_change?: string
}

// 遗嘱 (will)
interface WillRequest extends BaseGenerateRequest {
  name?: string
  age?: string
  marital?: string
  children?: string
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
  educationFund?: string
  educationFundAmount?: string
  charity?: string
  existingWill?: string
  existingWillDetails?: string
  familyConflict?: string
  complexAssets?: string
  overseasAssets?: string
}

// 分家析产 (division)
interface DivisionRequest extends BaseGenerateRequest {
  family_type?: string
  party_count?: string
  party_1_name?: string
  party_2_name?: string
  party_3_name?: string
  has_house?: string
  house_count?: string
  house_details?: string
  has_land?: string
  has_business?: string
  division_method?: string
  house_division?: string
  cash_division?: string
  unequal_reason?: string
  land_certificate?: string
  land_occupants?: string
  farmland_arrangement?: string
  business_name?: string
  business_division?: string
  debt_assumption?: string
  account_migration?: string
  guarantee_period?: string
  dispute_resolution?: string
}

type AnyGenerateRequest = PrenupRequest | MaritalRequest | DivorceRequest | CustodyRequest | GuardianshipRequest | DonationRequest | EstateRequest | WillRequest | DivisionRequest

// ============================================================
// 辅助函数
// ============================================================

function calculateComplexity(answers: AnyGenerateRequest, docType: string): number {
  let score = 0

  switch (docType) {
    case 'will': {
      const w = answers as WillRequest
      if (w.age && parseInt(w.age) > 60) score += 10
      if (w.age && parseInt(w.age) > 70) score += 10
      if (w.marital === '已婚') score += 15
      if (w.marital === '离异') score += 20
      const children = parseInt(w.children || '0')
      if (children > 0) score += children * 5
      if (children > 2) score += 10
      if (w.property === '有') score += 15
      if (w.savings?.includes('100')) score += 10
      if (w.stocks === '有') score += 15
      if (w.insurance === '有') score += 10
      if (w.vehicles === '有') score += 5
      if (w.debts === '有') score += 15
      if (w.heirType === '指定继承人') score += 20
      if (w.heirType === '混合') score += 25
      if (w.spouseInherit === '是') score += 10
      if (w.minorChild === '是') score += 20
      if (w.heirConditions) score += 15
      if (w.guardian === '是') score += 25
      if (w.pets === '有') score += 10
      if (w.educationFund === '是') score += 15
      if (w.charity === '是') score += 20
      if (w.existingWill === '有') score += 15
      if (w.familyConflict === '是') score += 30
      if (w.complexAssets === '是') score += 20
      if (w.overseasAssets === '有') score += 25
      break
    }
    case 'marital': {
      const m = answers as MaritalRequest
      if (m.house_1_owner && m.house_1_owner !== m.house_2_owner) score += 15
      if (m.savings_arrangement === '各自独立') score += 10
      if (m.has_company === '是') score += 20
      if (m.existing_debt === '有') score += 15
      if (m.future_debt_rule === '各自承担') score += 10
      break
    }
    case 'divorce': {
      const d = answers as DivorceRequest
      if (d.child_count && parseInt(d.child_count) > 0) score += parseInt(d.child_count) * 15
      if (d.house_division === '出售后分配') score += 15
      if (d.joint_debts === '有') score += 20
      if (d.custody_change === '是') score += 10
      break
    }
    case 'custody': {
      const c = answers as CustodyRequest
      if (c.custody_change === '是') score += 15
      if (c.support_amount && parseInt(c.support_amount) > 5000) score += 10
      if (c.other_major) score += 10
      break
    }
    case 'guardianship': {
      const g = answers as GuardianshipRequest
      if (g.trigger_condition === '部分丧失') score += 15
      if (g.has_supervisor === '是') score += 10
      if (g.financial_limit && parseInt(g.financial_limit) > 50000) score += 15
      break
    }
    case 'donation': {
      const dn = answers as DonationRequest
      if (dn.has_conditions === '是') score += 20
      if (dn.property_value && parseInt(dn.property_value) > 100) score += 15
      if (dn.revocation_conditions) score += 10
      break
    }
    case 'estate': {
      const e = answers as EstateRequest
      if (e.testator_children === '有') score += 15
      if (e.has_house === '有') score += 15
      if (e.property_after_death === '归扶养人') score += 20
      if (e.breach_by_caregiver) score += 10
      break
    }
    case 'division': {
      const dv = answers as DivisionRequest
      if (dv.house_count && parseInt(dv.house_count) > 1) score += 15
      if (dv.has_business === '是') score += 25
      if (dv.has_land === '是') score += 15
      if (dv.unequal_reason) score += 20
      break
    }
    case 'prenup': {
      const p = answers as PrenupRequest
      if (p.partyA_property === '有') score += 15
      if (p.marital_income === '各自独立') score += 10
      if (p.debt_arrangement === '各自承担') score += 15
      if (p.investment_arrangement === '各自独立') score += 10
      break
    }
  }

  return Math.min(score, 100)
}

function getComplexityLevel(score: number) {
  if (score < 30) return { level: '简单', description: '情况清晰，模板即可满足需求' }
  if (score < 60) return { level: '中等', description: '有一定复杂性，建议专业团队审核' }
  if (score < 80) return { level: '复杂', description: '涉及多方利益，需要专业指导' }
  return { level: '高度复杂', description: '强烈建议选择专家全程服务' }
}

function suggestTier(score: number) {
  if (score < 30) return { tier: 'ai-only', name: 'AI专属版' }
  if (score < 60) return { tier: 'ai-lawyer', name: '专家护航版' }
  return { tier: 'ai-lawyer', name: '专家护航版' }
}

function getMockLawyerProfile(tier: string) {
  const lawyers: Record<string, object> = {
    'ai-only': {
      name: '在线咨询',
      title: 'AI智能服务',
      description: '您可以使用AI服务自主完成文书起草',
      available: true,
    },
    'ai-lawyer': {
      name: '张专家',
      title: '资深婚姻继承专家',
      firm: '北京专业服务中心',
      experience: '15年执业经验',
      cases: '处理继承案件500+',
      rating: 4.9,
      available: true,
      nextAvailable: '明天 14:00',
    },
  }
  return lawyers[tier] || lawyers['ai-only']
}

async function generateWithMiniMax(prompt: string, docType: string): Promise<string> {
  if (!MINIMAX_API_KEY) {
    throw new Error('MINIMAX_API_KEY not configured')
  }

  const docTypeNames: Record<string, string> = {
    prenup: '婚前协议',
    marital: '婚内财产约定',
    divorce: '离婚协议',
    custody: '子女抚养权',
    guardianship: '意定监护',
    donation: '财产赠与',
    estate: '遗赠扶养',
    will: '遗嘱',
    division: '分家析产',
  }

  const docTypeName = docTypeNames[docType] || '法律文书'

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
          content: `你是一位专业的中国法律文书起草专家。请根据用户提供的规划信息，生成一份专业、严谨的${docTypeName}草案。

要求：
1. 严格遵循《中华人民共和国民法典》及相关法律规定
2. 语言正式、规范，体现法律文件的严肃性
3. 结构清晰，涵盖文书所需的关键条款
4. 对复杂情况给出专业建议
5. 末尾注明"本草案仅供参考，实际效力需经公证机构公证或专业团队审核确认"
6. 用中文回复，使用中文标点符号`
        },
        {
          role: 'user',
          content: `请根据以下信息生成${docTypeName}草案：

${prompt}

如果信息不足以生成完整文书，请在相应部分注明"待补充"，但仍要提供完整的文书框架。`
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

// ============================================================
// Prompt 构建函数
// ============================================================

function buildPrenupPrompt(a: PrenupRequest): string {
  const parts: string[] = []
  if (a.partyA_name) parts.push(`甲方姓名：${a.partyA_name}`)
  if (a.partyA_age) parts.push(`甲方年龄：${a.partyA_age}岁`)
  if (a.partyA_id) parts.push(`甲方身份证号：${a.partyA_id}`)
  if (a.partyB_name) parts.push(`乙方姓名：${a.partyB_name}`)
  if (a.partyB_age) parts.push(`乙方年龄：${a.partyB_age}岁`)
  if (a.partyB_id) parts.push(`乙方身份证号：${a.partyB_id}`)
  if (a.partyA_property) parts.push(`甲方婚前财产：${a.partyA_property}`)
  if (a.partyA_savings) parts.push(`甲方婚前存款：${a.partyA_savings}`)
  if (a.marital_income) parts.push(`婚后收入安排：${a.marital_income}`)
  if (a.house_purchase) parts.push(`购房计划：${a.house_purchase}`)
  if (a.car_ownership) parts.push(`车辆归属：${a.car_ownership}`)
  if (a.investment_arrangement) parts.push(`投资安排：${a.investment_arrangement}`)
  if (a.debt_arrangement) parts.push(`债务约定：${a.debt_arrangement}`)
  if (a.prenup_date) parts.push(`协议日期：${a.prenup_date}`)
  if (a.effective_date) parts.push(`生效日期：${a.effective_date}`)
  if (a.conditions) parts.push(`特殊条件：${a.conditions}`)
  if (a.other_terms) parts.push(`其他约定：${a.other_terms}`)
  return parts.join('\n')
}

function buildMaritalPrompt(a: MaritalRequest): string {
  const parts: string[] = []
  if (a.partyA_name) parts.push(`甲方姓名：${a.partyA_name}`)
  if (a.partyA_age) parts.push(`甲方年龄：${a.partyA_age}岁`)
  if (a.partyA_id) parts.push(`甲方身份证号：${a.partyA_id}`)
  if (a.partyB_name) parts.push(`乙方姓名：${a.partyB_name}`)
  if (a.partyB_id) parts.push(`乙方身份证号：${a.partyB_id}`)
  if (a.house_1_owner) parts.push(`房产1归属：${a.house_1_owner}`)
  if (a.house_1_details) parts.push(`房产1详情：${a.house_1_details}`)
  if (a.house_2_owner) parts.push(`房产2归属：${a.house_2_owner}`)
  if (a.house_2_details) parts.push(`房产2详情：${a.house_2_details}`)
  if (a.savings_arrangement) parts.push(`存款安排：${a.savings_arrangement}`)
  if (a.savings_amount_range) parts.push(`存款金额区间：${a.savings_amount_range}`)
  if (a.future_income) parts.push(`未来收入：${a.future_income}`)
  if (a.account_arrangement) parts.push(`账户安排：${a.account_arrangement}`)
  if (a.has_company) parts.push(`是否有公司：${a.has_company}`)
  if (a.company_equity_owner) parts.push(`股权归属人：${a.company_equity_owner}`)
  if (a.company_name) parts.push(`公司名称：${a.company_name}`)
  if (a.vehicle_owner) parts.push(`车辆归属：${a.vehicle_owner}`)
  if (a.investment_owner) parts.push(`投资归属：${a.investment_owner}`)
  if (a.debt_arrangement) parts.push(`债务约定：${a.debt_arrangement}`)
  if (a.existing_debt) parts.push(`现有债务：${a.existing_debt}`)
  if (a.future_debt_rule) parts.push(`未来债务规则：${a.future_debt_rule}`)
  if (a.debt_emergency) parts.push(`紧急债务处理：${a.debt_emergency}`)
  return parts.join('\n')
}

function buildDivorcePrompt(a: DivorceRequest): string {
  const parts: string[] = []
  if (a.partyA_name) parts.push(`甲方（夫）姓名：${a.partyA_name}`)
  if (a.partyB_name) parts.push(`乙方（妻）姓名：${a.partyB_name}`)
  if (a.marriage_date) parts.push(`结婚日期：${a.marriage_date}`)
  if (a.divorce_reason) parts.push(`离婚原因：${a.divorce_reason}`)
  if (a.voluntary) parts.push(`自愿离婚：${a.voluntary}`)
  if (a.child_custody_arrangement) parts.push(`子女抚养安排：${a.child_custody_arrangement}`)
  if (a.property_arrangement) parts.push(`财产安排：${a.property_arrangement}`)
  if (a.child_count) parts.push(`子女数量：${a.child_count}人`)
  if (a.child_1_custody) parts.push(`子女1抚养权：${a.child_1_custody}`)
  if (a.child_1_visit) parts.push(`子女1探视权：${a.child_1_visit}`)
  if (a.child_1_support) parts.push(`子女1抚养费：${a.child_1_support}`)
  if (a.child_1_support_amount) parts.push(`抚养费金额：${a.child_1_support_amount}`)
  if (a.house_division) parts.push(`房产分割：${a.house_division}`)
  if (a.house_details) parts.push(`房产详情：${a.house_details}`)
  if (a.savings_division) parts.push(`存款分割：${a.savings_division}`)
  if (a.vehicle_division) parts.push(`车辆分割：${a.vehicle_division}`)
  if (a.other_property) parts.push(`其他财产：${a.other_property}`)
  if (a.joint_debts) parts.push(`共同债务：${a.joint_debts}`)
  if (a.debt_details) parts.push(`债务详情：${a.debt_details}`)
  if (a.debt_creditor) parts.push(`债权人：${a.debt_creditor}`)
  if (a.account_location) parts.push(`账户所在地：${a.account_location}`)
  if (a.move_out_date) parts.push(`搬出日期：${a.move_out_date}`)
  if (a.other_terms) parts.push(`其他约定：${a.other_terms}`)
  return parts.join('\n')
}

function buildCustodyPrompt(a: CustodyRequest): string {
  const parts: string[] = []
  if (a.father_name) parts.push(`父亲姓名：${a.father_name}`)
  if (a.mother_name) parts.push(`母亲姓名：${a.mother_name}`)
  if (a.child_name) parts.push(`子女姓名：${a.child_name}`)
  if (a.child_age) parts.push(`子女年龄：${a.child_age}岁`)
  if (a.custody_holder) parts.push(`抚养权归属：${a.custody_holder}`)
  if (a.custody_change) parts.push(`变更抚养权：${a.custody_change}`)
  if (a.custody_change_terms) parts.push(`变更条件：${a.custody_change_terms}`)
  if (a.living_arrangement) parts.push(`居住安排：${a.living_arrangement}`)
  if (a.support_payer) parts.push(`抚养费支付方：${a.support_payer}`)
  if (a.support_amount) parts.push(`抚养费金额：${a.support_amount}`)
  if (a.support_payment_method) parts.push(`支付方式：${a.support_payment_method}`)
  if (a.support_account) parts.push(`收款账户：${a.support_account}`)
  if (a.visit_weekend) parts.push(`周末探视：${a.visit_weekend}`)
  if (a.visit_holiday) parts.push(`节假日探视：${a.visit_holiday}`)
  if (a.visit_summer) parts.push(`暑假探视：${a.visit_summer}`)
  if (a.medical_decision) parts.push(`医疗决策：${a.medical_decision}`)
  if (a.education_decision) parts.push(`教育决策：${a.education_decision}`)
  if (a.other_major) parts.push(`重大事项：${a.other_major}`)
  return parts.join('\n')
}

function buildGuardianshipPrompt(a: GuardianshipRequest): string {
  const parts: string[] = []
  if (a.name) parts.push(`委托人姓名：${a.name}`)
  if (a.age) parts.push(`委托人年龄：${a.age}岁`)
  if (a.id_card) parts.push(`委托人身份证号：${a.id_card}`)
  if (a.address) parts.push(`委托人地址：${a.address}`)
  if (a.guardian_1_name) parts.push(`监护人1姓名：${a.guardian_1_name}`)
  if (a.guardian_1_relation) parts.push(`监护人1关系：${a.guardian_1_relation}`)
  if (a.guardian_1_contact) parts.push(`监护人1联系方式：${a.guardian_1_contact}`)
  if (a.guardian_2_backup) parts.push(`备用监护人：${a.guardian_2_backup}`)
  if (a.property_management) parts.push(`财产管理：${a.property_management}`)
  if (a.medical_decision) parts.push(`医疗决策权：${a.medical_decision}`)
  if (a.daily_decision) parts.push(`日常决策权：${a.daily_decision}`)
  if (a.financial_limit) parts.push(`财务授权限额：${a.financial_limit}`)
  if (a.trigger_condition) parts.push(`触发条件：${a.trigger_condition}`)
  if (a.hospital_level) parts.push(`就医医院级别：${a.hospital_level}`)
  if (a.disability_type) parts.push(`失能类型：${a.disability_type}`)
  if (a.has_supervisor) parts.push(`是否有监督人：${a.has_supervisor}`)
  if (a.supervisor_name) parts.push(`监督人姓名：${a.supervisor_name}`)
  if (a.supervisor_duty) parts.push(`监督人职责：${a.supervisor_duty}`)
  return parts.join('\n')
}

function buildDonationPrompt(a: DonationRequest): string {
  const parts: string[] = []
  if (a.donor_name) parts.push(`赠与人姓名：${a.donor_name}`)
  if (a.donor_id) parts.push(`赠与人身份证号：${a.donor_id}`)
  if (a.donee_name) parts.push(`受赠人姓名：${a.donee_name}`)
  if (a.donee_id) parts.push(`受赠人身份证号：${a.donee_id}`)
  if (a.property_type) parts.push(`财产类型：${a.property_type}`)
  if (a.property_house) parts.push(`房产信息：${a.property_house}`)
  if (a.property_vehicle) parts.push(`车辆信息：${a.property_vehicle}`)
  if (a.property_value) parts.push(`财产价值：${a.property_value}`)
  if (a.property_rights) parts.push(`财产权利：${a.property_rights}`)
  if (a.has_conditions) parts.push(`是否有条件：${a.has_conditions}`)
  if (a.condition_details) parts.push(`条件详情：${a.condition_details}`)
  if (a.condition_failure) parts.push(`条件未达成：${a.condition_failure}`)
  if (a.transfer_time) parts.push(`过户时间：${a.transfer_time}`)
  if (a.tax_bearing) parts.push(`税费承担：${a.tax_bearing}`)
  if (a.related_property) parts.push(`关联财产：${a.related_property}`)
  if (a.revocation_conditions) parts.push(`撤销条件：${a.revocation_conditions}`)
  if (a.revocation_period) parts.push(`撤销期限：${a.revocation_period}`)
  if (a.dispute_resolution) parts.push(`争议解决：${a.dispute_resolution}`)
  return parts.join('\n')
}

function buildEstatePrompt(a: EstateRequest): string {
  const parts: string[] = []
  if (a.testator_name) parts.push(`遗赠人姓名：${a.testator_name}`)
  if (a.testator_age) parts.push(`遗赠人年龄：${a.testator_age}岁`)
  if (a.testator_health) parts.push(`遗赠人健康状况：${a.testator_health}`)
  if (a.testator_children) parts.push(`遗赠人子女：${a.testator_children}`)
  if (a.caregiver_name) parts.push(`扶养人姓名：${a.caregiver_name}`)
  if (a.caregiver_relation) parts.push(`扶养人与遗赠人关系：${a.caregiver_relation}`)
  if (a.caregiver_contact) parts.push(`扶养人联系方式：${a.caregiver_contact}`)
  if (a.has_house) parts.push(`是否有房产：${a.has_house}`)
  if (a.house_details) parts.push(`房产详情：${a.house_details}`)
  if (a.has_savings) parts.push(`是否有存款：${a.has_savings}`)
  if (a.savings_amount) parts.push(`存款金额：${a.savings_amount}`)
  if (a.care_type) parts.push(`扶养类型：${a.care_type}`)
  if (a.care_frequency) parts.push(`扶养频率：${a.care_frequency}`)
  if (a.care_expense) parts.push(`扶养费用：${a.care_expense}`)
  if (a.medical_expense) parts.push(`医疗费用：${a.medical_expense}`)
  if (a.testator_rights) parts.push(`遗赠人权利：${a.testator_rights}`)
  if (a.caregiver_duties) parts.push(`扶养人义务：${a.caregiver_duties}`)
  if (a.property_after_death) parts.push(`遗赠人死后财产：${a.property_after_death}`)
  if (a.breach_by_caregiver) parts.push(`扶养人违约：${a.breach_by_caregiver}`)
  if (a.breach_compensation) parts.push(`违约赔偿：${a.breach_compensation}`)
  if (a.agreement_change) parts.push(`协议变更：${a.agreement_change}`)
  return parts.join('\n')
}

function buildWillPrompt(a: WillRequest): string {
  const parts: string[] = []
  if (a.name) parts.push(`立遗嘱人姓名：${a.name}`)
  if (a.age) parts.push(`年龄：${a.age}岁`)
  if (a.marital) parts.push(`婚姻状况：${a.marital}`)
  if (a.children) parts.push(`子女数量：${a.children}人`)
  if (a.property) parts.push(`房产：${a.property}${a.propertyDesc ? '（' + a.propertyDesc + '）' : ''}`)
  if (a.savings) parts.push(`存款：${a.savings}`)
  if (a.stocks) parts.push(`股票基金：${a.stocks}`)
  if (a.insurance) parts.push(`保险：${a.insurance}`)
  if (a.vehicles) parts.push(`车辆：${a.vehicles}`)
  if (a.debts) parts.push(`负债：${a.debts}`)
  if (a.heirType) parts.push(`继承方式：${a.heirType}`)
  if (a.heirDetails) parts.push(`继承人详情：${a.heirDetails}`)
  if (a.spouseInherit) parts.push(`配偶继承份额：${a.spouseInherit}`)
  if (a.minorChild) parts.push(`未成年子女：${a.minorChild}`)
  if (a.heirConditions) parts.push(`继承条件：${a.heirConditions}`)
  if (a.guardian) parts.push(`监护人指定：${a.guardian === '是' ? '是，指定' + (a.guardianName || '待填写') : '否'}`)
  if (a.pets) parts.push(`宠物：${a.pets}${a.petArrangement ? '，安排：' + a.petArrangement : ''}`)
  if (a.educationFund) parts.push(`教育基金：${a.educationFund}${a.educationFundAmount ? '，金额：' + a.educationFundAmount : ''}`)
  if (a.charity) parts.push(`慈善捐赠：${a.charity}`)
  if (a.existingWill) parts.push(`现有遗嘱：${a.existingWill}${a.existingWillDetails ? '，详情：' + a.existingWillDetails : ''}`)
  if (a.familyConflict) parts.push(`家庭矛盾风险：${a.familyConflict}`)
  if (a.complexAssets) parts.push(`复杂资产：${a.complexAssets}`)
  if (a.overseasAssets) parts.push(`海外资产：${a.overseasAssets}`)
  return parts.join('\n')
}

function buildDivisionPrompt(a: DivisionRequest): string {
  const parts: string[] = []
  if (a.family_type) parts.push(`家庭类型：${a.family_type}`)
  if (a.party_count) parts.push(`参与人数：${a.party_count}人`)
  if (a.party_1_name) parts.push(`当事人1姓名：${a.party_1_name}`)
  if (a.party_2_name) parts.push(`当事人2姓名：${a.party_2_name}`)
  if (a.party_3_name) parts.push(`当事人3姓名：${a.party_3_name}`)
  if (a.has_house) parts.push(`是否有房产：${a.has_house}`)
  if (a.house_count) parts.push(`房产数量：${a.house_count}`)
  if (a.house_details) parts.push(`房产详情：${a.house_details}`)
  if (a.has_land) parts.push(`是否有土地：${a.has_land}`)
  if (a.has_business) parts.push(`是否有企业：${a.has_business}`)
  if (a.division_method) parts.push(`分割方式：${a.division_method}`)
  if (a.house_division) parts.push(`房产分割方案：${a.house_division}`)
  if (a.cash_division) parts.push(`现金分割方案：${a.cash_division}`)
  if (a.unequal_reason) parts.push(`不均等分割理由：${a.unequal_reason}`)
  if (a.land_certificate) parts.push(`土地证：${a.land_certificate}`)
  if (a.land_occupants) parts.push(`土地使用人：${a.land_occupants}`)
  if (a.farmland_arrangement) parts.push(`农田安排：${a.farmland_arrangement}`)
  if (a.business_name) parts.push(`企业名称：${a.business_name}`)
  if (a.business_division) parts.push(`企业分割方案：${a.business_division}`)
  if (a.debt_assumption) parts.push(`债务承担：${a.debt_assumption}`)
  if (a.account_migration) parts.push(`账户迁移：${a.account_migration}`)
  if (a.guarantee_period) parts.push(`保证期限：${a.guarantee_period}`)
  if (a.dispute_resolution) parts.push(`争议解决：${a.dispute_resolution}`)
  return parts.join('\n')
}

// ============================================================
// 模板生成函数（无 API Key 时的 Mock fallback）
// ============================================================

function generatePrenupTemplate(a: PrenupRequest): string {
  return `# 婚前协议

甲方（夫）：${a.partyA_name || '__________'}
性别：男
身份证号：${a.partyA_id || '____________________'}
年龄：${a.partyA_age || '___'}岁

乙方（妻）：${a.partyB_name || '__________'}
性别：女
身份证号：${a.partyB_id || '____________________'}
年龄：${a.partyB_age || '___'}岁

## 第一条 协议目的

甲、乙双方已于${a.prenup_date || '____年____月____日'}相识并决定缔结婚姻关系。为明确双方婚前及婚后财产关系，依据《中华人民共和国民法典》及相关法律法规，经双方平等协商，签订本协议。

## 第二条 婚前财产归属

### 2.1 甲方婚前个人财产
${a.partyA_property || '（详细列明甲方婚前拥有的房产、存款、车辆、股票等财产）'}
${a.partyA_savings ? `甲方婚前存款：人民币${a.partyA_savings}元` : ''}

### 2.2 乙方婚前个人财产
（详细列明乙方婚前拥有的房产、存款、车辆、股票等财产）

### 2.3 婚前财产约定
双方确认，各自婚前名下的财产归各自所有，婚前财产不因婚姻关系的建立而转化为夫妻共同财产。

## 第三条 婚后财产归属

### 3.1 婚后收入安排
${a.marital_income || '（约定婚后各自收入归各自所有/共同所有/部分共同）'}

### 3.2 购房安排
${a.house_purchase || '（约定婚后购房的出资方式、产权归属）'}

### 3.3 车辆归属
${a.car_ownership || '（约定婚后购车的出资方式、产权归属）'}

### 3.4 投资安排
${a.investment_arrangement || '（约定婚后投资收益的归属）'}

## 第四条 债务约定

${a.debt_arrangement || '双方约定婚后各自名下的债务由各自承担，因家庭共同生活所产生的债务由双方共同承担。'}

## 第五条 协议生效

本协议自双方签字之日起生效，有效期至双方婚姻关系终止。

本协议未尽事宜，由双方另行协商补充，补充协议与本协议具有同等法律效力。

---
**声明**：本草案仅供参考，实际效力需经公证机构公证或专业团队审核确认。

甲方签字：___________
日期：___________

乙方签字：___________
日期：___________`
}

function generateMaritalTemplate(a: MaritalRequest): string {
  return `# 婚内财产约定协议

甲方：${a.partyA_name || '__________'}
身份证号：${a.partyA_id || '____________________'}
年龄：${a.partyA_age || '___'}岁

乙方：${a.partyB_name || '__________'}
身份证号：${a.partyB_id || '____________________'}

## 第一条 前言

甲、乙双方于____年____月____日登记结婚，系合法夫妻。现双方经平等协商，就婚内财产归属等问题达成如下协议，以供双方共同遵守。

## 第二条 房产约定

### 2.1 房产一
${a.house_1_owner ? `归属：${a.house_1_owner}` : '（待填写）'}
${a.house_1_details ? `详情：${a.house_1_details}` : ''}

### 2.2 房产二
${a.house_2_owner ? `归属：${a.house_2_owner}` : '（待填写）'}
${a.house_2_details ? `详情：${a.house_2_details}` : ''}

### 2.3 房产约定
双方确认，上述房产的归属按照本协议约定执行，不因婚姻关系的存续而改变权属。

## 第三条 存款约定

### 3.1 存款安排
${a.savings_arrangement || '（各自独立/共同所有/部分共同）'}
${a.savings_amount_range ? `金额区间：${a.savings_amount_range}` : ''}

### 3.2 账户安排
${a.account_arrangement || '（各自账户归各自管理/共同管理）'}

## 第四条 未来收入约定

${a.future_income || '（约定婚后各自收入归各自所有/共同所有/部分共同）'}

## 第五条 公司股权

${a.has_company === '是' ? `公司名称：${a.company_name || ''}\n股权归属人：${a.company_equity_owner || ''}\n（详细约定股权收益、处置方式）` : '双方婚内未设立公司或暂无公司股权安排。'}

## 第六条 车辆归属

${a.vehicle_owner ? `车辆归属：${a.vehicle_owner}` : '（待填写车辆信息及归属约定）'}

## 第七条 投资归属

${a.investment_owner ? `投资归属：${a.investment_owner}` : '（待填写投资信息及归属约定）'}

## 第八条 债务约定

### 8.1 现有债务
${a.existing_debt ? `现有债务情况：${a.existing_debt}` : '双方确认目前无共同债务。'}

### 8.2 未来债务规则
${a.future_debt_rule || '（约定婚后各自名下债务由各自承担/共同承担）'}

### 8.3 紧急债务处理
${a.debt_emergency || '（约定紧急情况下的债务处理方式）'}

## 第九条 其他约定

${a.debt_arrangement || ''}

## 第十条 附则

本协议自双方签字之日起生效，对双方均具有法律约束力。

本协议一式两份，甲、乙双方各执一份，具有同等法律效力。

---
**声明**：本草案仅供参考，实际效力需经公证机构公证或专业团队审核确认。

甲方签字：___________
日期：___________

乙方签字：___________
日期：___________`
}

function generateDivorceTemplate(a: DivorceRequest): string {
  return `# 离婚协议

甲方（夫）：${a.partyA_name || '__________'}
乙方（妻）：${a.partyB_name || '__________'}

## 第一条 前言

甲、乙双方于${a.marriage_date || '____年____月____日'}登记结婚，现因${a.divorce_reason || '（填写离婚原因）'}，经双方协商一致，自愿解除婚姻关系，并就子女抚养、财产分割、债权债务处理等事项达成如下协议。

## 第二条 离婚意愿

双方确认，本协议系双方自愿签订，不存在欺诈、胁迫等情形。${a.voluntary === '是' ? '双方系自愿离婚。' : ''}

## 第三条 子女抚养

### 3.1 子女基本情况
子女数量：${a.child_count || '___'}人

### 3.2 抚养安排
${a.child_custody_arrangement || '（约定子女抚养权归属）'}

### 3.3 抚养费
${a.child_1_support ? `${a.child_1_custody || '子女'}抚养费：${a.child_1_support}${a.child_1_support_amount ? `，金额：${a.child_1_support_amount}元/月` : ''}` : ''}

### 3.4 探视权
${a.child_1_visit ? `探视权约定：${a.child_1_visit}` : ''}
${a.visit_weekend ? `周末探视：${a.visit_weekend}` : ''}
${a.visit_holiday ? `节假日探视：${a.visit_holiday}` : ''}
${a.visit_summer ? `暑假探视：${a.visit_summer}` : ''}

## 第四条 财产分割

### 4.1 房产分割
${a.house_division || '（约定房产归属及分割方式）'}
${a.house_details ? `房产详情：${a.house_details}` : ''}

### 4.2 存款分割
${a.savings_division || '（约定存款分割方式）'}

### 4.3 车辆分割
${a.vehicle_division || '（约定车辆归属）'}

### 4.4 其他财产
${a.other_property || '（列明其他需要分割的财产）'}

## 第五条 债权债务

### 5.1 共同债务
${a.joint_debts === '有' ? `共同债务：${a.debt_details || ''}\n债权人：${a.debt_creditor || ''}\n（约定债务承担方式）` : '双方确认无共同债务，或共同债务已清偿完毕。'}

### 5.2 账户迁移
${a.account_location ? `账户所在地/迁移：${a.account_location}` : ''}

## 第六条 迁出安排

${a.move_out_date ? `迁出日期：${a.move_out_date}` : '（约定一方迁出共同住所的时间）'}

## 第七条 其他约定

${a.other_terms || ''}

---
**声明**：本草案仅供参考，实际效力需经婚姻登记机关办理离婚登记或专业团队审核确认。

甲方签字：___________
日期：___________

乙方签字：___________
日期：___________`
}

function generateCustodyTemplate(a: CustodyRequest): string {
  return `# 子女抚养权协议

父亲：${a.father_name || '__________'}
母亲：${a.mother_name || '__________'}
子女：${a.child_name || '__________'}（${a.child_age || '___'}岁）

## 第一条 前言

甲、乙双方系夫妻关系，现就子女抚养权等相关事宜达成如下协议。

## 第二条 抚养权归属

### 2.1 抚养权
${a.custody_holder || '（约定抚养权归属）'}

### 2.2 变更抚养权
${a.custody_change === '是' ? `变更抚养权：${a.custody_change_terms || ''}` : '双方确认不变更抚养权。'}

## 第三条 居住安排

${a.living_arrangement || '（约定子女居住地及居住安排）'}

## 第四条 抚养费

### 4.1 支付方
${a.support_payer || '（约定抚养费支付方）'}

### 4.2 金额
${a.support_amount ? `抚养费金额：人民币${a.support_amount}元/月` : ''}

### 4.3 支付方式
${a.support_payment_method || '（约定支付方式）'}
${a.support_account ? `收款账户：${a.support_account}` : ''}

## 第五条 探视权

${a.visit_weekend ? `周末探视：${a.visit_weekend}` : ''}
${a.visit_holiday ? `节假日探视：${a.visit_holiday}` : ''}
${a.visit_summer ? `暑假探视：${a.visit_summer}` : ''}

## 第六条 重大事项决定

### 6.1 医疗决策
${a.medical_decision || '（约定医疗决策权归属）'}

### 6.2 教育决策
${a.education_decision || '（约定教育决策权归属）'}

### 6.3 其他重大事项
${a.other_major || ''}

---
**声明**：本草案仅供参考，实际效力需经法院调解或判决确认。

父亲签字：___________
日期：___________

母亲签字：___________
日期：___________`
}

function generateGuardianshipTemplate(a: GuardianshipRequest): string {
  return `# 意定监护协议

委托人：${a.name || '__________'}
年龄：${a.age || '___'}岁
身份证号：${a.id_card || '____________________'}
住所地：${a.address || '____________________'}

## 第一条 前言

委托人因${a.trigger_condition || '（填写触发条件，如：年老、精神障碍、智力障碍等）'}，现依据《中华人民共和国民法典》相关规定，就监护事项与被指定监护人达成如下协议。

## 第二条 监护人指定

### 2.1 首选监护人
姓名：${a.guardian_1_name || '__________'}
与委托人关系：${a.guardian_1_relation || '__________'}
联系方式：${a.guardian_1_contact || '____________________'}

### 2.2 备用监护人
${a.guardian_2_backup || '（如有备用监护人，请填写）'}

## 第三条 监护范围

### 3.1 财产管理
${a.property_management || '（约定财产管理权限、范围、方式）'}

### 3.2 医疗决策权
${a.medical_decision || '（约定医疗决策权归属及范围）'}
${a.hospital_level ? `就医医院级别：${a.hospital_level}` : ''}

### 3.3 日常决策权
${a.daily_decision || '（约定日常生活的决策权限）'}

### 3.4 财务授权限额
${a.financial_limit ? `财务授权限额：人民币${a.financial_limit}元` : ''}

## 第四条 触发条件

${a.trigger_condition || '（详细约定何种情况下监护开始生效）'}
${a.disability_type ? `失能类型：${a.disability_type}` : ''}

## 第五条 监督安排

${a.has_supervisor === '是' ? `监督人：${a.supervisor_name || ''}\n监督人职责：${a.supervisor_duty || ''}` : '双方确认无需设立监督人。'}

---
**声明**：本草案仅供参考，实际效力需经公证机构公证或专业团队审核确认。

委托人签字：___________
日期：___________

监护人签字：___________
日期：___________`
}

function generateDonationTemplate(a: DonationRequest): string {
  return `# 财产赠与协议

赠与人：${a.donor_name || '__________'}
身份证号：${a.donor_id || '____________________'}

受赠人：${a.donee_name || '__________'}
身份证号：${a.donee_id || '____________________'}

## 第一条 前言

赠与人与受赠人系${a.related_property ? `与该财产相关的${a.related_property}` : '（填写双方关系）'}关系。现赠与人自愿将下列财产赠与受赠人，双方经协商一致，签订本协议。

## 第二条 赠与财产

### 2.1 财产类型
${a.property_type || '（房产/车辆/存款/其他）'}

### 2.2 财产详情
${a.property_house ? `房产信息：${a.property_house}` : ''}
${a.property_vehicle ? `车辆信息：${a.property_vehicle}` : ''}
${a.property_value ? `财产价值：人民币${a.property_value}万元` : ''}
${a.property_rights ? `财产权利：${a.property_rights}` : ''}

## 第三条 赠与条件

${a.has_conditions === '是' ? `本赠与为附条件赠与，条件如下：\n${a.condition_details || ''}\n\n${a.condition_failure ? `条件未达成时：${a.condition_failure}` : ''}` : '本赠与为无条件赠与。'}

## 第四条 过户安排

### 4.1 过户时间
${a.transfer_time || '（约定过户时间）'}

### 4.2 税费承担
${a.tax_bearing || '（约定过户税费由谁承担）'}

## 第五条 撤销约定

${a.revocation_conditions ? `撤销条件：${a.revocation_conditions}` : ''}
${a.revocation_period ? `撤销期限：${a.revocation_period}` : ''}

## 第六条 争议解决

${a.dispute_resolution || '如发生争议，双方协商解决；协商不成的，提交合同签订地人民法院管辖。'}

---
**声明**：本草案仅供参考，实际效力需经公证机构公证或专业团队审核确认。

赠与人签字：___________
日期：___________

受赠人签字：___________
日期：___________`
}

function generateEstateTemplate(a: EstateRequest): string {
  return `# 遗赠扶养协议

遗赠人（被扶养人）：${a.testator_name || '__________'}
年龄：${a.testator_age || '___'}岁
健康状况：${a.testator_health || '__________'}
子女情况：${a.testator_children || '__________'}

扶养人：${a.caregiver_name || '__________'}
与遗赠人关系：${a.caregiver_relation || '__________'}
联系方式：${a.caregiver_contact || '____________________'}

## 第一条 前言

遗赠人因${a.testator_health || '（填写健康状况）'}，需要他人扶养照顾；扶养人自愿承担遗赠人的扶养义务。双方经协商一致，就遗赠扶养事宜达成如下协议。

## 第二条 财产清单

### 2.1 房产
${a.has_house === '有' ? `${a.house_details || '（详细描述房产情况）'}` : '遗赠人名下无房产或房产已做其他安排。'}

### 2.2 存款
${a.has_savings === '有' ? `${a.savings_amount ? `存款金额：人民币${a.savings_amount}元` : '（待填写）'}` : '遗赠人名下无存款或存款已做其他安排。'}

## 第三条 扶养义务

### 3.1 扶养类型
${a.care_type || '（约定扶养方式，如：日常照料/全天候护理/定期探访等）'}

### 3.2 扶养频率
${a.care_frequency || '（约定扶养频率，如：每周探访/每日照料等）'}

### 3.3 扶养费用
${a.care_expense ? `日常扶养费用：${a.care_expense}` : '（约定扶养费用的承担方式）'}

### 3.4 医疗费用
${a.medical_expense || '（约定医疗费用的承担方式）'}

## 第四条 双方权利义务

### 4.1 遗赠人权利
${a.testator_rights || '（约定遗赠人保留的权利）'}

### 4.2 扶养人义务
${a.caregiver_duties || '（约定扶养人应履行的具体义务）'}

## 第五条 财产归属

### 5.1 扶养期间
遗赠人去世前，财产由遗赠人所有，扶养人仅负责管理。

### 5.2 去世后财产
${a.property_after_death || '（约定遗赠人去世后财产的归属）'}

## 第六条 违约责任

### 6.1 扶养人违约
${a.breach_by_caregiver || '（约定扶养人违约时的处理方式）'}
${a.breach_compensation ? `违约赔偿：${a.breach_compensation}` : ''}

### 6.2 协议变更
${a.agreement_change || '（约定协议变更的条件和方式）'}

---
**声明**：本草案仅供参考，实际效力需经公证机构公证或专业团队审核确认。

遗赠人签字：___________
日期：___________

扶养人签字：___________
日期：___________`
}

function generateWillTemplate(a: WillRequest): string {
  return `# 遗嘱草案

立遗嘱人：${a.name || '先生/女士'}
年龄：${a.age || 'XX'}岁

## 第一条 前言

本人意识清醒、精神状态良好，具有完全民事行为能力。现依据《中华人民共和国民法典》继承编相关规定，制定本遗嘱，对本人合法财产作出如下安排。

## 第二条 财产状况

### 2.1 房产
${a.property === '有' ? `本人拥有房产，具体情况如下：${a.propertyDesc || '详见附件'}` : '本人名下无房产或房产已做其他安排。'}

### 2.2 存款及金融资产
${a.savings ? `本人存款及金融资产情况：${a.savings}` : '本人存款情况详见附件。'}

### 2.3 其他财产
- 股票基金：${a.stocks === '有' ? '有，具体情况详见附件' : '无'}
- 保险：${a.insurance === '有' ? '有，具体情况详见附件' : '无'}
- 车辆：${a.vehicles === '有' ? '有，具体情况详见附件' : '无'}

### 2.4 负债情况
${a.debts === '有' ? '本人存在一定负债，请在继承时予以考虑，具体情况详见附件。' : '本人无负债或负债已清偿完毕。'}

## 第三条 继承人安排

### 3.1 继承方式
${a.heirType || '法定继承'}

### 3.2 具体分配
${a.heirDetails || '按照法律规定执行'}

${a.spouseInherit === '是' ? '### 3.3 配偶份额\n本人配偶依法享有相应的继承份额，具体比例按照法律规定执行。' : ''}

${a.minorChild === '是' ? '### 3.4 未成年子女\n对于未成年的子女，已作出特别安排，确保其权益得到保障。' : ''}

${a.heirConditions ? `### 3.5 继承条件\n${a.heirConditions}` : ''}

## 第四条 特殊安排

${a.guardian === '是' ? `### 4.1 监护人指定\n如本人配偶无法继续抚养子女，指定${a.guardianName || 'XXX'}为子女的监护人。` : ''}

${a.pets === '有' ? `### 4.2 宠物安排\n${a.petArrangement || '宠物由家人照顾'}。` : ''}

## 第五条 教育基金

${a.educationFund === '是' ? `本人决定设立教育基金，金额为${a.educationFundAmount || '人民币XX万元'}，用于子女教育。` : '未设立专项教育基金。'}

## 第六条 慈善捐赠

${a.charity === '是' ? `本人愿意将部分财产用于慈善事业，详见附件。` : '未安排慈善捐赠。'}

## 第七条 附则

${a.existingWill === '有' ? `本遗嘱为最新版本，此前如有遗嘱，以本遗嘱为准。\n此前遗嘱情况：${a.existingWillDetails || ''}` : ''}

${a.familyConflict ? `家庭矛盾风险提示：${a.familyConflict}` : ''}

${a.complexAssets === '是' ? '涉及复杂资产，请专业团队协助处理。' : ''}

${a.overseasAssets === '有' ? '涉及海外资产，请关注跨境继承相关规定。' : ''}

---

**声明**：本草案仅供参考，实际效力需经公证机构公证或专业团队审核确认。

立遗嘱人：___________
日期：___________`
}

function generateDivisionTemplate(a: DivisionRequest): string {
  return `# 分家析产协议

## 第一条 前言

${a.family_type ? `家庭类型：${a.family_type}` : '（填写家庭类型，如：农村家庭/城市家庭/三代同堂等）'}
参与人数：${a.party_count || '___'}人

当事人：
- 当事人1：${a.party_1_name || '__________'}
- 当事人2：${a.party_2_name || '__________'}
${a.party_3_name ? `- 当事人3：${a.party_3_name}` : ''}

现各方经协商一致，就家庭共有财产分割事宜达成如下协议。

## 第二条 财产清单

### 2.1 房产
${a.has_house === '有' ? `房产数量：${a.house_count || ''}\n房产详情：${a.house_details || ''}` : '家庭无房产或房产已做其他安排。'}

### 2.2 土地
${a.has_land === '有' ? `土地证：${a.land_certificate || ''}\n土地使用人：${a.land_occupants || ''}\n农田安排：${a.farmland_arrangement || ''}` : '家庭无土地或土地已做其他安排。'}

### 2.3 企业
${a.has_business === '是' ? `企业名称：${a.business_name || ''}\n企业分割方案：${a.business_division || ''}` : '家庭无企业或企业已做其他安排。'}

## 第三条 分割方案

### 3.1 分割方式
${a.division_method || '（约定分割方式：均等分割/不均等分割）'}

### 3.2 房产分割
${a.house_division || '（约定各当事人房产分配方案）'}

### 3.3 现金分割
${a.cash_division || '（约定现金分配方案）'}

### 3.4 不均等分割原因
${a.unequal_reason ? `因${a.unequal_reason}，各方同意不均等分割。` : ''}

## 第四条 企业股权分割

${a.business_division || '（如有企业，详细约定股权分割方案）'}

## 第五条 债务承担

${a.debt_assumption || '（约定各方债务承担方式）'}

## 第六条 后续事宜

### 6.1 账户迁移
${a.account_migration || '（约定账户迁移相关事宜）'}

### 6.2 保证期限
${a.guarantee_period ? `保证期限：${a.guarantee_period}` : '（约定各方相互保证的期限）'}

## 第七条 争议解决

${a.dispute_resolution || '如发生争议，各方协商解决；协商不成的，提交合同签订地人民法院管辖。'}

---
**声明**：本草案仅供参考，实际效力需经公证机构公证或专业团队审核确认。

当事人1签字：___________
日期：___________

当事人2签字：___________
日期：___________

${a.party_3_name ? `当事人3签字：___________\n日期：___________` : ''}`
}

// ============================================================
// 主路由
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { docType, ...answers } = body

    const complexityScore = calculateComplexity(answers, docType)
    const complexityLevel = getComplexityLevel(complexityScore)
    const suggestedTier = suggestTier(complexityScore)
    const lawyerProfile = getMockLawyerProfile(suggestedTier.tier)

    let draft: string

    if (MINIMAX_API_KEY && MINIMAX_API_KEY !== '***') {
      // 有 API Key，调用 MiniMax
      let prompt: string
      switch (docType) {
        case 'prenup':
          prompt = buildPrenupPrompt(answers as PrenupRequest)
          break
        case 'marital':
          prompt = buildMaritalPrompt(answers as MaritalRequest)
          break
        case 'divorce':
          prompt = buildDivorcePrompt(answers as DivorceRequest)
          break
        case 'custody':
          prompt = buildCustodyPrompt(answers as CustodyRequest)
          break
        case 'guardianship':
          prompt = buildGuardianshipPrompt(answers as GuardianshipRequest)
          break
        case 'donation':
          prompt = buildDonationPrompt(answers as DonationRequest)
          break
        case 'estate':
          prompt = buildEstatePrompt(answers as EstateRequest)
          break
        case 'will':
          prompt = buildWillPrompt(answers as WillRequest)
          break
        case 'division':
          prompt = buildDivisionPrompt(answers as DivisionRequest)
          break
        default:
          prompt = buildWillPrompt(answers as WillRequest)
      }
      draft = await generateWithMiniMax(prompt, docType)
    } else {
      // 无 API Key，使用 Mock 模板
      switch (docType) {
        case 'prenup':
          draft = generatePrenupTemplate(answers as PrenupRequest)
          break
        case 'marital':
          draft = generateMaritalTemplate(answers as MaritalRequest)
          break
        case 'divorce':
          draft = generateDivorceTemplate(answers as DivorceRequest)
          break
        case 'custody':
          draft = generateCustodyTemplate(answers as CustodyRequest)
          break
        case 'guardianship':
          draft = generateGuardianshipTemplate(answers as GuardianshipRequest)
          break
        case 'donation':
          draft = generateDonationTemplate(answers as DonationRequest)
          break
        case 'estate':
          draft = generateEstateTemplate(answers as EstateRequest)
          break
        case 'will':
          draft = generateWillTemplate(answers as WillRequest)
          break
        case 'division':
          draft = generateDivisionTemplate(answers as DivisionRequest)
          break
        default:
          draft = generateWillTemplate(answers as WillRequest)
      }
    }

    return NextResponse.json({
      success: true,
      draft,
      complexity: {
        score: complexityScore,
        level: complexityLevel.level,
        description: complexityLevel.description,
      },
      suggestedTier: suggestedTier,
      lawyerProfile,
      generatedAt: new Date().toISOString(),
      apiUsed: !!(MINIMAX_API_KEY && MINIMAX_API_KEY !== '***'),
    })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '生成失败，请重试' },
      { status: 500 }
    )
  }
}
