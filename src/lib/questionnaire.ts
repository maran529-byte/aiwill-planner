// 文书类型枚举
export type DocumentType =
  | 'prenup'     // 婚前协议
  | 'marital'    // 婚内财产约定
  | 'divorce'    // 离婚协议
  | 'custody'    // 抚养权/抚养费协议
  | 'guardianship' // 意定监护协议
  | 'donation'  // 财产赠与协议
  | 'estate'     // 遗赠扶养协议
  | 'will'       // 遗嘱
  | 'division';  // 分家析产协议

export interface Question {
  id: string;
  moduleId: number;
  moduleName: string;
  question: string;
  type: 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'textarea';
  options?: string[];
  placeholder?: string;
  skipIf?: {
    field: string;
    value: any;
  };
  required: boolean;
}

export interface Module {
  id: number;
  name: string;
  description: string;
  questionCount: number;
}

// ============================================================
// 婚前协议 (prenup) - 结婚前签署，明确双方财产归属
// ============================================================
const prenupModules: Module[] = [
  { id: 1, name: '基本信息', description: '双方基本情况', questionCount: 5 },
  { id: 2, name: '财产状况', description: '各自婚前财产', questionCount: 6 },
  { id: 3, name: '婚后财产', description: '婚后所得归属', questionCount: 5 },
  { id: 4, name: '债务约定', description: '债务承担规则', questionCount: 3 },
  { id: 5, name: '其他约定', description: '其他重要约定', questionCount: 3 },
];

const prenupQuestions: Question[] = [
  // Module 1: Basic Info
  { id: 'partyA_name', moduleId: 1, moduleName: '基本信息', question: '甲方（您）姓名', type: 'text', placeholder: '请输入甲方姓名', required: true },
  { id: 'partyA_age', moduleId: 1, moduleName: '基本信息', question: '甲方年龄', type: 'number', placeholder: '请输入年龄', required: true },
  { id: 'partyA_id', moduleId: 1, moduleName: '基本信息', question: '甲方身份证号', type: 'text', placeholder: '请输入身份证号', required: true },
  { id: 'partyB_name', moduleId: 1, moduleName: '基本信息', question: '乙方（对方）姓名', type: 'text', placeholder: '请输入乙方姓名', required: true },
  { id: 'partyB_age', moduleId: 1, moduleName: '基本信息', question: '乙方年龄', type: 'number', placeholder: '请输入年龄', required: true },
  // Module 2: Property Status
  { id: 'partyA_property', moduleId: 2, moduleName: '财产状况', question: '甲方婚前是否有房产', type: 'radio', options: ['有', '无'], required: true },
  { id: 'partyA_property_details', moduleId: 2, moduleName: '财产状况', question: '甲方婚前房产情况', type: 'textarea', placeholder: '如：北京市朝阳区房产，婚后需还贷', skipIf: { field: 'partyA_property', value: '无' }, required: false },
  { id: 'partyA_savings', moduleId: 2, moduleName: '财产状况', question: '甲方婚前存款范围', type: 'select', options: ['10万以下', '10-50万', '50-100万', '100万以上'], required: true },
  { id: 'partyB_property', moduleId: 2, moduleName: '财产状况', question: '乙方婚前是否有房产', type: 'radio', options: ['有', '无'], required: true },
  { id: 'partyB_property_details', moduleId: 2, moduleName: '财产状况', question: '乙方婚前房产情况', type: 'textarea', placeholder: '如：上海市浦东新区房产', skipIf: { field: 'partyB_property', value: '无' }, required: false },
  { id: 'partyB_savings', moduleId: 2, moduleName: '财产状况', question: '乙方婚前存款范围', type: 'select', options: ['10万以下', '10-50万', '50-100万', '100万以上'], required: true },
  // Module 3: Marital Property
  { id: 'marital_income', moduleId: 3, moduleName: '婚后财产', question: '婚后各自收入归属', type: 'select', options: ['各自所有', '共同所有', '按比例共有'], required: true },
  { id: 'house_purchase', moduleId: 3, moduleName: '婚后财产', question: '婚后购买房产归属', type: 'select', options: ['各自所有', '共同所有', '首付方所有', '按出资比例'], required: true },
  { id: 'car_ownership', moduleId: 3, moduleName: '婚后财产', question: '婚后购买车辆归属', type: 'select', options: ['各自所有', '共同所有', '登记方所有'], required: true },
  { id: 'investment', moduleId: 3, moduleName: '婚后财产', question: '婚后投资收益归属', type: 'select', options: ['各自所有', '共同所有', '本金方所有'], required: true },
  { id: 'inheritance', moduleId: 3, moduleName: '婚后财产', question: '婚后继承/受赠财产归属', type: 'select', options: ['各自所有', '共同所有', '按情况约定'], required: true },
  // Module 4: Debts
  { id: 'existing_debts', moduleId: 4, moduleName: '债务约定', question: '婚前各自债务处理方式', type: 'select', options: ['各自承担', '连带承担', '债权人知晓方承担'], required: true },
  { id: 'future_debts', moduleId: 4, moduleName: '债务约定', question: '婚后新增债务处理方式', type: 'select', options: ['各自承担', '共同承担', '事发方承担'], required: true },
  { id: 'debt_emergency', moduleId: 4, moduleName: '债务约定', question: '一方被追债时另一方义务', type: 'select', options: ['无义务', '协助处理', '共同偿还'], required: true },
  // Module 5: Other
  { id: 'divorce_property', moduleId: 5, moduleName: '其他约定', question: '离婚时财产分割原则', type: 'select', options: ['平均分割', '各自所有', '按贡献大小', '协议约定'], required: true },
  { id: 'spousal_support', moduleId: 5, moduleName: '其他约定', question: '是否约定离婚扶养费', type: 'radio', options: ['是', '否'], required: true },
  { id: 'other_terms', moduleId: 5, moduleName: '其他约定', question: '其他特别约定', type: 'textarea', placeholder: '如：任何一方不得隐藏财产等', required: false },
];

// ============================================================
// 婚内财产约定 (marital) - 婚后签署，明确共同/各自财产归属
// ============================================================
const maritalModules: Module[] = [
  { id: 1, name: '基本信息', description: '夫妻双方情况', questionCount: 4 },
  { id: 2, name: '房产约定', description: '房产归属安排', questionCount: 4 },
  { id: 3, name: '存款约定', description: '存款归属安排', questionCount: 4 },
  { id: 4, name: '股权约定', description: '公司股权归属', questionCount: 3 },
  { id: 5, name: '其他财产', description: '车辆/投资/债权等', questionCount: 3 },
  { id: 6, name: '债务约定', description: '共同/个人债务', questionCount: 3 },
];

const maritalQuestions: Question[] = [
  // Module 1: Basic Info
  { id: 'partyA_name', moduleId: 1, moduleName: '基本信息', question: '甲方（夫）姓名', type: 'text', placeholder: '请输入甲方姓名', required: true },
  { id: 'partyA_id', moduleId: 1, moduleName: '基本信息', question: '甲方身份证号', type: 'text', placeholder: '请输入身份证号', required: true },
  { id: 'partyB_name', moduleId: 1, moduleName: '基本信息', question: '乙方（妻）姓名', type: 'text', placeholder: '请输入乙方姓名', required: true },
  { id: 'partyB_id', moduleId: 1, moduleName: '基本信息', question: '乙方身份证号', type: 'text', placeholder: '请输入身份证号', required: true },
  // Module 2: House Property
  { id: 'house_1_owner', moduleId: 2, moduleName: '房产约定', question: '第一套房产归属', type: 'select', options: ['甲方所有', '乙方所有', '共同所有', '按份共有'], required: true },
  { id: 'house_1_details', moduleId: 2, moduleName: '房产约定', question: '第一套房产详情', type: 'textarea', placeholder: '如：北京市海淀区房产，建筑面积90㎡', required: false },
  { id: 'house_2_owner', moduleId: 2, moduleName: '房产约定', question: '第二套房产归属（如有）', type: 'select', options: ['甲方所有', '乙方所有', '共同所有', '按份共有', '无第二套房'], required: true },
  { id: 'house_2_details', moduleId: 2, moduleName: '房产约定', question: '第二套房产详情', type: 'textarea', placeholder: '如：成都市武侯区房产', skipIf: { field: 'house_2_owner', value: '无第二套房' }, required: false },
  // Module 3: Savings
  { id: 'savings_arrangement', moduleId: 3, moduleName: '存款约定', question: '现有存款归属', type: 'select', options: ['各自所有', '共同所有', '按比例共有', '部分共同部分各自'], required: true },
  { id: 'savings_amount_range', moduleId: 3, moduleName: '存款约定', question: '存款金额范围', type: 'select', options: ['10万以下', '10-50万', '50-100万', '100-500万', '500万以上'], required: true },
  { id: 'future_income', moduleId: 3, moduleName: '存款约定', question: '婚后收入归属', type: 'select', options: ['各自所有', '共同所有', '按比例共有', '部分共同部分各自'], required: true },
  { id: 'account_arrangement', moduleId: 3, moduleName: '存款约定', question: '银行账户安排', type: 'select', options: ['各自管理', '共同管理', '一方管理一方知情'], required: true },
  // Module 4: Equity
  { id: 'has_company', moduleId: 4, moduleName: '股权约定', question: '是否持有公司股权', type: 'radio', options: ['是', '否'], required: true },
  { id: 'company_equity_owner', moduleId: 4, moduleName: '股权约定', question: '股权归属', type: 'select', options: ['甲方所有', '乙方所有', '共同所有', '按比例共有'], skipIf: { field: 'has_company', value: '否' }, required: true },
  { id: 'company_name', moduleId: 4, moduleName: '股权约定', question: '公司名称', type: 'text', placeholder: '请输入公司全称', skipIf: { field: 'has_company', value: '否' }, required: false },
  // Module 5: Other Property
  { id: 'vehicle_owner', moduleId: 5, moduleName: '其他财产', question: '车辆归属', type: 'select', options: ['甲方所有', '乙方所有', '共同所有'], required: true },
  { id: 'investment_owner', moduleId: 5, moduleName: '其他财产', question: '股票/基金/理财产品归属', type: 'select', options: ['甲方所有', '乙方所有', '共同所有', '按比例共有'], required: true },
  { id: 'debt_arrangement', moduleId: 5, moduleName: '其他财产', question: '其他财产/债权债务说明', type: 'textarea', placeholder: '请说明其他重要财产安排', required: false },
  // Module 6: Debts
  { id: 'existing_debt', moduleId: 6, moduleName: '债务约定', question: '现有共同债务处理', type: 'select', options: ['共同承担', '各自承担', '约定承担方'], required: true },
  { id: 'future_debt_rule', moduleId: 6, moduleName: '债务约定', question: '婚后新增债务规则', type: 'select', options: ['共同承担', '各自承担', '签字方承担'], required: true },
  { id: 'debt_emergency', moduleId: 6, moduleName: '债务约定', question: '一方债务危机时另一方权利', type: 'select', options: ['无义务', '协助处理', '保全自身权益'], required: true },
];

// ============================================================
// 离婚协议 (divorce) - 离婚时财产分割、子女抚养安排
// ============================================================
const divorceModules: Module[] = [
  { id: 1, name: '基本信息', description: '双方基本情况', questionCount: 4 },
  { id: 2, name: '离婚意愿', description: '离婚条件确认', questionCount: 3 },
  { id: 3, name: '子女安排', description: '子女抚养权抚养费', questionCount: 5 },
  { id: 4, name: '财产分割', description: '房产存款车辆分割', questionCount: 5 },
  { id: 5, name: '债权债务', description: '债务承担', questionCount: 3 },
  { id: 6, name: '其他约定', description: '户口/探视/违约金等', questionCount: 3 },
];

const divorceQuestions: Question[] = [
  // Module 1: Basic Info
  { id: 'partyA_name', moduleId: 1, moduleName: '基本信息', question: '甲方（您）姓名', type: 'text', placeholder: '请输入甲方姓名', required: true },
  { id: 'partyB_name', moduleId: 1, moduleName: '基本信息', question: '乙方（对方）姓名', type: 'text', placeholder: '请输入乙方姓名', required: true },
  { id: 'marriage_date', moduleId: 1, moduleName: '基本信息', question: '结婚登记日期', type: 'text', placeholder: '如：2015年6月1日', required: true },
  { id: 'divorce_reason', moduleId: 1, moduleName: '基本信息', question: '离婚原因简述', type: 'textarea', placeholder: '简要说明离婚原因', required: false },
  // Module 2: Divorce Terms
  { id: 'voluntary', moduleId: 2, moduleName: '离婚意愿', question: '双方是否自愿离婚', type: 'radio', options: ['是，双方自愿', '一方提出，另一方同意'], required: true },
  { id: 'child_custody_arrangement', moduleId: 2, moduleName: '离婚意愿', question: '子女抚养权安排是否已协商一致', type: 'radio', options: ['是', '否，需法院判决'], required: true },
  { id: 'property_arrangement', moduleId: 2, moduleName: '离婚意愿', question: '财产分割是否已协商一致', type: 'radio', options: ['是', '否，需法院判决'], required: true },
  // Module 3: Children
  { id: 'child_count', moduleId: 3, moduleName: '子女安排', question: '子女数量', type: 'number', placeholder: '请输入子女数量', required: true },
  { id: 'child_1_custody', moduleId: 3, moduleName: '子女安排', question: '子女1抚养权归属', type: 'select', options: ['甲方抚养', '乙方抚养', '轮流抚养'], skipIf: { field: 'child_count', value: 0 }, required: true },
  { id: 'child_1_visit', moduleId: 3, moduleName: '子女安排', question: '子女1探视权安排', type: 'textarea', placeholder: '如：每周六上午接走，周日下午送回', skipIf: { field: 'child_count', value: 0 }, required: false },
  { id: 'child_1_support', moduleId: 3, moduleName: '子女安排', question: '子女1抚养费', type: 'select', options: ['甲方支付', '乙方支付', '一方不要'], skipIf: { field: 'child_count', value: 0 }, required: true },
  { id: 'child_1_support_amount', moduleId: 3, moduleName: '子女安排', question: '抚养费金额（元/月）', type: 'number', placeholder: '如：3000', skipIf: { field: 'child_1_support', value: '一方不要' }, required: false },
  // Module 4: Property Division
  { id: 'house_division', moduleId: 4, moduleName: '财产分割', question: '房产分割方案', type: 'select', options: ['归甲方所有', '归乙方所有', '出售后平分', '其他'], required: true },
  { id: 'house_details', moduleId: 4, moduleName: '财产分割', question: '房产详情', type: 'textarea', placeholder: '如：北京市朝阳区房产，市场价值800万', required: false },
  { id: 'savings_division', moduleId: 4, moduleName: '财产分割', question: '存款分割方案', type: 'select', options: ['平分', '归一方所有', '按比例分割'], required: true },
  { id: 'vehicle_division', moduleId: 4, moduleName: '财产分割', question: '车辆分割', type: 'select', options: ['归甲方所有', '归乙方所有', '出售后平分', '无车辆'], required: true },
  { id: 'other_property', moduleId: 4, moduleName: '财产分割', question: '其他财产分割说明', type: 'textarea', placeholder: '如：股票、基金、家具等', required: false },
  // Module 5: Debts
  { id: 'joint_debts', moduleId: 5, moduleName: '债权债务', question: '共同债务处理', type: 'select', options: ['共同偿还', '一方承担', '按比例承担'], required: true },
  { id: 'debt_details', moduleId: 5, moduleName: '债权债务', question: '债务详情', type: 'textarea', placeholder: '如：房贷200万，车贷10万', required: false },
  { id: 'debt_creditor', moduleId: 5, moduleName: '债权债务', question: '一方单独债务由谁承担', type: 'select', options: ['举债方独自承担', '双方共同承担'], required: true },
  // Module 6: Other
  { id: 'account_location', moduleId: 6, moduleName: '其他约定', question: '户口迁移安排', type: 'select', options: ['甲方迁出', '乙方迁出', '暂不迁移'], required: true },
  { id: 'move_out_date', moduleId: 6, moduleName: '其他约定', question: '搬离时间', type: 'text', placeholder: '如：离婚后30日内', required: false },
  { id: 'other_terms', moduleId: 6, moduleName: '其他约定', question: '其他约定事项', type: 'textarea', placeholder: '如：违约责任、保密条款等', required: false },
];

// ============================================================
// 抚养权/抚养费协议 (custody) - 离婚后子女抚养专项协议
// ============================================================
const custodyModules: Module[] = [
  { id: 1, name: '基本信息', description: '父母与子女信息', questionCount: 4 },
  { id: 2, name: '抚养权', description: '抚养权归属安排', questionCount: 4 },
  { id: 3, name: '抚养费', description: '抚养费标准与支付', questionCount: 4 },
  { id: 4, name: '探视权', description: '探视规则安排', questionCount: 3 },
  { id: 5, name: '重大事项', description: '医疗教育等决策', questionCount: 3 },
];

const custodyQuestions: Question[] = [
  // Module 1: Basic Info
  { id: 'father_name', moduleId: 1, moduleName: '基本信息', question: '父亲姓名', type: 'text', placeholder: '请输入父亲姓名', required: true },
  { id: 'mother_name', moduleId: 1, moduleName: '基本信息', question: '母亲姓名', type: 'text', placeholder: '请输入母亲姓名', required: true },
  { id: 'child_name', moduleId: 1, moduleName: '基本信息', question: '子女姓名', type: 'text', placeholder: '请输入子女姓名', required: true },
  { id: 'child_age', moduleId: 1, moduleName: '基本信息', question: '子女年龄', type: 'number', placeholder: '请输入年龄', required: true },
  // Module 2: Custody
  { id: 'custody_holder', moduleId: 2, moduleName: '抚养权', question: '抚养权归属', type: 'select', options: ['父亲', '母亲', '轮流抚养'], required: true },
  { id: 'custody_change', moduleId: 2, moduleName: '抚养权', question: '是否约定抚养权变更条件', type: 'radio', options: ['是', '否'], required: true },
  { id: 'custody_change_terms', moduleId: 2, moduleName: '抚养权', question: '抚养权变更条件', type: 'textarea', placeholder: '如：一方经济状况重大变化、子女满8周岁后意愿等', skipIf: { field: 'custody_change', value: '否' }, required: false },
  { id: 'living_arrangement', moduleId: 2, moduleName: '抚养权', question: '子女居住安排', type: 'textarea', placeholder: '如：随父亲居住，位于北京市朝阳区', required: false },
  // Module 3: Child Support
  { id: 'support_payer', moduleId: 3, moduleName: '抚养费', question: '抚养费支付方', type: 'select', options: ['父亲支付', '母亲支付'], required: true },
  { id: 'support_amount', moduleId: 3, moduleName: '抚养费', question: '每月抚养费金额（元）', type: 'number', placeholder: '如：3000', required: true },
  { id: 'support_payment_method', moduleId: 3, moduleName: '抚养费', question: '支付方式', type: 'select', options: ['银行转账', '支付宝/微信', '现金'], required: true },
  { id: 'support_account', moduleId: 3, moduleName: '抚养费', question: '收款账户信息', type: 'text', placeholder: '如：工商银行 6222 **** 8888', required: false },
  // Module 4: Visitation
  { id: 'visit_weekend', moduleId: 4, moduleName: '探视权', question: '周末探视安排', type: 'select', options: ['每周', '隔周', '不固定', '无'], required: true },
  { id: 'visit_holiday', moduleId: 4, moduleName: '探视权', question: '节假日探视安排', type: 'textarea', placeholder: '如：春节期间轮流团聚，暑假乙方带子女出游', required: false },
  { id: 'visit_summer', moduleId: 4, moduleName: '探视权', question: '寒暑假特殊安排', type: 'select', options: ['与一方长期居住', '轮流各半', '协商安排'], required: true },
  // Module 5: Major Decisions
  { id: 'medical_decision', moduleId: 5, moduleName: '重大事项', question: '重大医疗决策权', type: 'select', options: ['抚养方决定', '双方协商', '通知另一方'], required: true },
  { id: 'education_decision', moduleId: 5, moduleName: '重大事项', question: '重大教育决策权', type: 'select', options: ['抚养方决定', '双方协商'], required: true },
  { id: 'other_major', moduleId: 5, moduleName: '重大事项', question: '其他重大事项约定', type: 'textarea', placeholder: '如：移民、改名等需双方同意', required: false },
];

// ============================================================
// 意定监护协议 (guardianship) - 指定丧失行为能力时的监护人
// ============================================================
const guardianshipModules: Module[] = [
  { id: 1, name: '基本信息', description: '委托人信息', questionCount: 4 },
  { id: 2, name: '监护人指定', description: '意定监护人安排', questionCount: 4 },
  { id: 3, name: '监护范围', description: '财产与医疗决策', questionCount: 4 },
  { id: 4, name: '触发条件', description: '监护生效条件', questionCount: 3 },
  { id: 5, name: '监督安排', description: '监督人与退出机制', questionCount: 3 },
];

const guardianshipQuestions: Question[] = [
  // Module 1: Basic Info
  { id: 'name', moduleId: 1, moduleName: '基本信息', question: '委托人姓名', type: 'text', placeholder: '请输入姓名', required: true },
  { id: 'age', moduleId: 1, moduleName: '基本信息', question: '委托人年龄', type: 'number', placeholder: '请输入年龄', required: true },
  { id: 'id_card', moduleId: 1, moduleName: '基本信息', question: '委托人身份证号', type: 'text', placeholder: '请输入身份证号', required: true },
  { id: 'address', moduleId: 1, moduleName: '基本信息', question: '委托人住址', type: 'text', placeholder: '请输入住址', required: true },
  // Module 2: Guardian
  { id: 'guardian_1_name', moduleId: 2, moduleName: '监护人指定', question: '第一顺序监护人姓名', type: 'text', placeholder: '请输入监护人姓名', required: true },
  { id: 'guardian_1_relation', moduleId: 2, moduleName: '监护人指定', question: '与监护人关系', type: 'text', placeholder: '如：配偶/子女/兄弟姐妹/朋友', required: true },
  { id: 'guardian_1_contact', moduleId: 2, moduleName: '监护人指定', question: '监护人联系方式', type: 'text', placeholder: '请输入手机号', required: true },
  { id: 'guardian_2_backup', moduleId: 2, moduleName: '监护人指定', question: '是否有备选监护人', type: 'radio', options: ['是', '否'], required: true },
  // Module 3: Scope
  { id: 'property_management', moduleId: 3, moduleName: '监护范围', question: '财产管理权限', type: 'select', options: ['全部财产', '一定限额内', '需监督人同意'], required: true },
  { id: 'medical_decision', moduleId: 3, moduleName: '监护范围', question: '医疗决策权限', type: 'select', options: ['全权决定', '重大决定需通知', '需监督人同意'], required: true },
  { id: 'daily_decision', moduleId: 3, moduleName: '监护范围', question: '日常生活决策权限', type: 'select', options: ['全权决定', '一定限额内', '需监督人同意'], required: true },
  { id: 'financial_limit', moduleId: 3, moduleName: '监护范围', question: '未经同意的单笔支出限额（元）', type: 'number', placeholder: '如：10000', required: false },
  // Module 4: Trigger Conditions
  { id: 'trigger_condition', moduleId: 4, moduleName: '触发条件', question: '监护生效的认定方式', type: 'select', options: ['医院诊断证明', '法院宣告', '公证处认定', '多种方式组合'], required: true },
  { id: 'hospital_level', moduleId: 4, moduleName: '触发条件', question: '病情认定医院级别', type: 'select', options: ['三级甲等医院', '二级及以上医院', '指定医院'], skipIf: { field: 'trigger_condition', value: '法院宣告' }, required: false },
  { id: 'disability_type', moduleId: 4, moduleName: '触发条件', question: '适用情形', type: 'select', options: ['认知障碍（如老年痴呆）', '精神障碍', '植物人状态', '重度肢体残疾', '多种情形'], required: true },
  // Module 5: Supervision
  { id: 'has_supervisor', moduleId: 5, moduleName: '监督安排', question: '是否指定监督人', type: 'radio', options: ['是', '否'], required: true },
  { id: 'supervisor_name', moduleId: 5, moduleName: '监督安排', question: '监督人姓名', type: 'text', placeholder: '请输入监督人姓名', skipIf: { field: 'has_supervisor', value: '否' }, required: false },
  { id: 'supervisor_duty', moduleId: 5, moduleName: '监督安排', question: '监督人职责', type: 'textarea', placeholder: '如：定期核查财产状况、每年向公证处报告等', skipIf: { field: 'has_supervisor', value: '否' }, required: false },
];

// ============================================================
// 财产赠与协议 (donation) - 房产/车辆等大额财产赠与
// ============================================================
const donationModules: Module[] = [
  { id: 1, name: '基本信息', description: '赠与人与受赠人', questionCount: 4 },
  { id: 2, name: '赠与财产', description: '财产详情与归属', questionCount: 5 },
  { id: 3, name: '赠与条件', description: '附条件赠与条款', questionCount: 3 },
  { id: 4, name: '过户安排', description: '产权过户与税费', questionCount: 3 },
  { id: 5, name: '撤销约定', description: '赠与撤销条件', questionCount: 3 },
];

const donationQuestions: Question[] = [
  // Module 1: Basic Info
  { id: 'donor_name', moduleId: 1, moduleName: '基本信息', question: '赠与人姓名', type: 'text', placeholder: '请输入赠与人姓名', required: true },
  { id: 'donor_id', moduleId: 1, moduleName: '基本信息', question: '赠与人身份证号', type: 'text', placeholder: '请输入身份证号', required: true },
  { id: 'donee_name', moduleId: 1, moduleName: '基本信息', question: '受赠与人姓名', type: 'text', placeholder: '请输入受赠与人姓名', required: true },
  { id: 'donee_id', moduleId: 1, moduleName: '基本信息', question: '受赠与人身份证号', type: 'text', placeholder: '请输入身份证号', required: true },
  // Module 2: Property Details
  { id: 'property_type', moduleId: 2, moduleName: '赠与财产', question: '财产类型', type: 'select', options: ['房产', '车辆', '存款', '股权', '其他'], required: true },
  { id: 'property_house', moduleId: 2, moduleName: '赠与财产', question: '房产详情', type: 'textarea', placeholder: '如：北京市朝阳区房产，建筑面积90㎡，市场价500万', skipIf: { field: 'property_type', value: '车辆' }, required: false },
  { id: 'property_vehicle', moduleId: 2, moduleName: '赠与财产', question: '车辆详情', type: 'textarea', placeholder: '如：宝马牌轿车，车牌号京A12345', skipIf: { field: 'property_type', value: '房产' }, required: false },
  { id: 'property_value', moduleId: 2, moduleName: '赠与财产', question: '财产价值（元）', type: 'number', placeholder: '请输入估算价值', required: true },
  { id: 'property_rights', moduleId: 2, moduleName: '赠与财产', question: '赠与权利类型', type: 'select', options: ['完全所有权', '使用权/居住权', '部分份额'], required: true },
  // Module 3: Conditions
  { id: 'has_conditions', moduleId: 3, moduleName: '赠与条件', question: '是否为附条件赠与', type: 'radio', options: ['是', '否'], required: true },
  { id: 'condition_details', moduleId: 3, moduleName: '赠与条件', question: '赠与条件说明', type: 'textarea', placeholder: '如：受赠人需照顾赠与人至百年，或受赠人需完成学业', skipIf: { field: 'has_conditions', value: '否' }, required: false },
  { id: 'condition_failure', moduleId: 3, moduleName: '赠与条件', question: '条件未达成时的处理', type: 'select', options: ['赠与撤销', '赠与物返还', '折价补偿'], skipIf: { field: 'has_conditions', value: '否' }, required: true },
  // Module 4: Transfer
  { id: 'transfer_time', moduleId: 4, moduleName: '过户安排', question: '产权过户时间', type: 'select', options: ['即期过户', '附条件成就时过户', '赠与人百年后过户'], required: true },
  { id: 'tax_bearing', moduleId: 4, moduleName: '过户安排', question: '过户税费承担', type: 'select', options: ['赠与人承担', '受赠人承担', '双方共同承担'], required: true },
  { id: 'related_property', moduleId: 4, moduleName: '过户安排', question: '房产是否有关联人员户籍', type: 'select', options: ['是，需迁出', '否', '不涉及'], skipIf: { field: 'property_type', value: '车辆' }, required: false },
  // Module 5: Revocation
  { id: 'revocation_conditions', moduleId: 5, moduleName: '撤销约定', question: '法定撤销情形的处理', type: 'select', options: ['按法律规定执行', '约定不适用某些情形', '全部放弃撤销权'], required: true },
  { id: 'revocation_period', moduleId: 5, moduleName: '撤销约定', question: '撤销权行使期限（年）', type: 'number', placeholder: '如：5', required: false },
  { id: 'dispute_resolution', moduleId: 5, moduleName: '撤销约定', question: '赠与纠纷解决方式', type: 'select', options: ['协商', '调解', '诉讼'], required: true },
];

// ============================================================
// 遗赠扶养协议 (estate) - 赡养人扶养，遗赠人死后财产转归赡养人
// ============================================================
const estateModules: Module[] = [
  { id: 1, name: '遗赠人信息', description: '财产所有人的情况', questionCount: 4 },
  { id: 2, name: '扶养人信息', description: '承担扶养义务的人', questionCount: 3 },
  { id: 3, name: '财产清单', description: '遗赠财产明细', questionCount: 4 },
  { id: 4, name: '扶养义务', description: '赡养方式与标准', questionCount: 4 },
  { id: 5, name: '权利义务', description: '双方其他权利义务', questionCount: 3 },
  { id: 6, name: '违约责任', description: '协议变更与终止', questionCount: 3 },
];

const estateQuestions: Question[] = [
  // Module 1: Testator Info
  { id: 'testator_name', moduleId: 1, moduleName: '遗赠人信息', question: '遗赠人姓名', type: 'text', placeholder: '请输入姓名', required: true },
  { id: 'testator_age', moduleId: 1, moduleName: '遗赠人信息', question: '遗赠人年龄', type: 'number', placeholder: '请输入年龄', required: true },
  { id: 'testator_health', moduleId: 1, moduleName: '遗赠人信息', question: '身体状况', type: 'select', options: ['健康', '一般', '较差', '有重大疾病'], required: true },
  { id: 'testator_children', moduleId: 1, moduleName: '遗赠人信息', question: '是否有子女', type: 'radio', options: ['有', '无'], required: true },
  // Module 2: Caregiver Info
  { id: 'caregiver_name', moduleId: 2, moduleName: '扶养人信息', question: '扶养人姓名', type: 'text', placeholder: '请输入姓名', required: true },
  { id: 'caregiver_relation', moduleId: 2, moduleName: '扶养人信息', question: '与遗赠人关系', type: 'select', options: ['亲属', '朋友', '邻居', '其他人'], required: true },
  { id: 'caregiver_contact', moduleId: 2, moduleName: '扶养人信息', question: '扶养人联系方式', type: 'text', placeholder: '请输入手机号', required: true },
  // Module 3: Property List
  { id: 'has_house', moduleId: 3, moduleName: '财产清单', question: '是否有房产', type: 'radio', options: ['是', '否'], required: true },
  { id: 'house_details', moduleId: 3, moduleName: '财产清单', question: '房产详情', type: 'textarea', placeholder: '如：北京市朝阳区房产，建筑面积80㎡', skipIf: { field: 'has_house', value: '否' }, required: false },
  { id: 'has_savings', moduleId: 3, moduleName: '财产清单', question: '是否有存款', type: 'radio', options: ['是', '否'], required: true },
  { id: 'savings_amount', moduleId: 3, moduleName: '财产清单', question: '存款金额范围', type: 'select', options: ['10万以下', '10-50万', '50-100万', '100万以上'], skipIf: { field: 'has_savings', value: '否' }, required: false },
  // Module 4: Care Obligations
  { id: 'care_type', moduleId: 4, moduleName: '扶养义务', question: '扶养方式', type: 'select', options: ['共同居住', '定期探望照顾', '聘请保姆/护工', '入住养老院'], required: true },
  { id: 'care_frequency', moduleId: 4, moduleName: '扶养义务', question: '探望照顾频率', type: 'select', options: ['每天', '每周数次', '每月数次'], skipIf: { field: 'care_type', value: '共同居住' }, required: false },
  { id: 'care_expense', moduleId: 4, moduleName: '扶养义务', question: '扶养费用承担', type: 'select', options: ['扶养人承担', '遗赠人财产支付', '双方共同承担'], required: true },
  { id: 'medical_expense', moduleId: 4, moduleName: '扶养义务', question: '医疗费用承担', type: 'select', options: ['扶养人承担', '遗赠人财产支付', '医保+自费部分分担'], required: true },
  // Module 5: Rights & Obligations
  { id: 'testator_rights', moduleId: 5, moduleName: '权利义务', question: '遗赠人保留权利', type: 'textarea', placeholder: '如：生前保留居住权、可变更受益人等', required: false },
  { id: 'caregiver_duties', moduleId: 5, moduleName: '权利义务', question: '扶养人特定义务', type: 'textarea', placeholder: '如：不得虐待遗赠人、需定期陪诊等', required: false },
  { id: 'property_after_death', moduleId: 5, moduleName: '权利义务', question: '遗赠人百年后财产归属', type: 'select', options: ['全部归扶养人', '部分归扶养人其余按法定继承', '全部按遗赠处理'], required: true },
  // Module 6: Breach
  { id: 'breach_by_caregiver', moduleId: 6, moduleName: '违约责任', question: '扶养人违约时的处理', type: 'select', options: ['支付违约金', '返还部分财产', '协议解除'], required: true },
  { id: 'breach_compensation', moduleId: 6, moduleName: '违约责任', question: '违约金金额（元）', type: 'number', placeholder: '如：50000', required: false },
  { id: 'agreement_change', moduleId: 6, moduleName: '违约责任', question: '协议变更方式', type: 'select', options: ['双方协商', '需公证', '单方不得变更'], required: true },
];

// ============================================================
// 遗嘱 (will) - 最后的遗愿安排
// ============================================================
const willModules: Module[] = [
  { id: 1, name: '基本信息', description: '了解您的基本情况', questionCount: 4 },
  { id: 2, name: '资产状况', description: '梳理您的财富', questionCount: 6 },
  { id: 3, name: '继承人安排', description: '您对家人的爱', questionCount: 5 },
  { id: 4, name: '特殊安排', description: '细致入微的关怀', questionCount: 4 },
  { id: 5, name: '传承条件', description: '附加爱的嘱托', questionCount: 3 },
  { id: 6, name: '已有安排', description: '既往安排梳理', questionCount: 2 },
  { id: 7, name: '风险评估', description: '全面保障无遗漏', questionCount: 3 },
];

const willQuestions: Question[] = [
  // Module 1: Basic Info
  { id: 'name', moduleId: 1, moduleName: '基本信息', question: '您的姓名', type: 'text', placeholder: '请输入您的姓名', required: true },
  { id: 'age', moduleId: 1, moduleName: '基本信息', question: '您的年龄', type: 'number', placeholder: '请输入年龄', required: true },
  { id: 'marital', moduleId: 1, moduleName: '基本信息', question: '您的婚姻状况', type: 'select', options: ['未婚', '已婚', '离异', '丧偶'], required: true },
  { id: 'children', moduleId: 1, moduleName: '基本信息', question: '您有几个子女', type: 'number', placeholder: '请输入子女数量', required: true },
  // Module 2: Assets
  { id: 'property', moduleId: 2, moduleName: '资产状况', question: '您是否有房产', type: 'radio', options: ['有', '无'], required: true },
  { id: 'propertyDesc', moduleId: 2, moduleName: '资产状况', question: '请描述您的房产情况', type: 'textarea', placeholder: '如：北京市朝阳区一套三居室房产，市场价约800万', skipIf: { field: 'property', value: '无' }, required: false },
  { id: 'savings', moduleId: 2, moduleName: '资产状况', question: '您是否有存款及金额范围', type: 'select', options: ['10万以下', '10-50万', '50-100万', '100-500万', '500万以上', '无'], required: true },
  { id: 'stocks', moduleId: 2, moduleName: '资产状况', question: '您是否有股票基金等投资', type: 'radio', options: ['有', '无'], required: true },
  { id: 'insurance', moduleId: 2, moduleName: '资产状况', question: '您是否有保险', type: 'radio', options: ['有', '无'], required: true },
  { id: 'vehicles', moduleId: 2, moduleName: '资产状况', question: '您是否有车辆', type: 'radio', options: ['有', '无'], required: true },
  { id: 'debts', moduleId: 2, moduleName: '资产状况', question: '您是否有负债', type: 'radio', options: ['有', '无'], required: true },
  // Module 3: Heirs
  { id: 'heirType', moduleId: 3, moduleName: '继承人安排', question: '您希望如何指定继承人', type: 'select', options: ['法定继承人', '指定继承人', '混合'], required: true },
  { id: 'heirDetails', moduleId: 3, moduleName: '继承人安排', question: '请说明继承人及分配比例', type: 'textarea', placeholder: '如：长子30%，次子30%，配偶40%', required: true },
  { id: 'spouseInherit', moduleId: 3, moduleName: '继承人安排', question: '是否预留配偶份额', type: 'radio', options: ['是', '否'], skipIf: { field: 'marital', value: '未婚' }, required: true },
  { id: 'minorChild', moduleId: 3, moduleName: '继承人安排', question: '是否有未成年子女需要特别安排', type: 'radio', options: ['是', '否'], skipIf: { field: 'children', value: 0 }, required: true },
  { id: 'heirConditions', moduleId: 3, moduleName: '继承人安排', question: '继承人是否需要满足特定条件', type: 'textarea', placeholder: '如：子女年满25岁方可继承，或结婚后方可继承', required: false },
  // Module 4: Special Arrangements
  { id: 'guardian', moduleId: 4, moduleName: '特殊安排', question: '是否需要指定监护人', type: 'radio', options: ['是', '否'], skipIf: { field: 'children', value: 0 }, required: true },
  { id: 'guardianName', moduleId: 4, moduleName: '特殊安排', question: '请指定监护人', type: 'text', placeholder: '请输入监护人姓名', skipIf: { field: 'guardian', value: '否' }, required: true },
  { id: 'pets', moduleId: 4, moduleName: '特殊安排', question: '是否有宠物需要安排', type: 'radio', options: ['是', '否'], required: true },
  { id: 'petArrangement', moduleId: 4, moduleName: '特殊安排', question: '请说明宠物安排', type: 'textarea', placeholder: '如：由女儿负责照顾，给予女儿5万元作为照顾费用', skipIf: { field: 'pets', value: '否' }, required: true },
  // Module 5: Conditions
  { id: 'educationFund', moduleId: 5, moduleName: '传承条件', question: '是否需要设置教育基金', type: 'radio', options: ['是', '否'], required: true },
  { id: 'educationFundAmount', moduleId: 5, moduleName: '传承条件', question: '教育基金金额', type: 'text', placeholder: '请输入金额', skipIf: { field: 'educationFund', value: '否' }, required: true },
  { id: 'charity', moduleId: 5, moduleName: '传承条件', question: '是否有慈善捐赠意愿', type: 'radio', options: ['是', '否'], required: true },
  // Module 6: Existing Arrangements
  { id: 'existingWill', moduleId: 6, moduleName: '已有安排', question: '是否已有遗嘱', type: 'radio', options: ['是', '否'], required: true },
  { id: 'existingWillDetails', moduleId: 6, moduleName: '已有安排', question: '请说明现有遗嘱情况', type: 'textarea', placeholder: '请简要说明现有遗嘱的内容', skipIf: { field: 'existingWill', value: '否' }, required: true },
  // Module 7: Risk
  { id: 'familyConflict', moduleId: 7, moduleName: '风险评估', question: '家庭成员间是否存在潜在矛盾', type: 'radio', options: ['是', '否'], required: true },
  { id: 'complexAssets', moduleId: 7, moduleName: '风险评估', question: '资产构成是否复杂', type: 'radio', options: ['是', '否'], required: true },
  { id: 'overseasAssets', moduleId: 7, moduleName: '风险评估', question: '是否有海外资产', type: 'radio', options: ['是', '否'], required: true },
];

// ============================================================
// 分家析产协议 (division) - 家庭内部财产分割（父母与子女、兄弟姐妹间）
// ============================================================
const divisionModules: Module[] = [
  { id: 1, name: '基本信息', description: '家庭成员信息', questionCount: 5 },
  { id: 2, name: '财产清单', description: '待分割财产明细', questionCount: 5 },
  { id: 3, name: '分割方案', description: '财产分割方式', questionCount: 4 },
  { id: 4, name: '宅基地/农房', description: '农村房产特殊处理', questionCount: 3 },
  { id: 5, name: '企业/股权', description: '家庭企业经营分割', questionCount: 3 },
  { id: 6, name: '后续事宜', description: '户籍/债务/效力', questionCount: 3 },
];

const divisionQuestions: Question[] = [
  // Module 1: Basic Info
  { id: 'family_type', moduleId: 1, moduleName: '基本信息', question: '分家类型', type: 'select', options: ['父母与子女间', '兄弟姐妹间', '多子女家庭内部'], required: true },
  { id: 'party_count', moduleId: 1, moduleName: '基本信息', question: '参与分家人数', type: 'number', placeholder: '请输入参与分家的人数', required: true },
  { id: 'party_1_name', moduleId: 1, moduleName: '基本信息', question: '甲方（通常为父母或长子）姓名', type: 'text', placeholder: '请输入甲方姓名', required: true },
  { id: 'party_2_name', moduleId: 1, moduleName: '基本信息', question: '乙方姓名', type: 'text', placeholder: '请输入乙方姓名', required: true },
  { id: 'party_3_name', moduleId: 1, moduleName: '基本信息', question: '丙方姓名（如有）', type: 'text', placeholder: '请输入丙方姓名', required: false },
  // Module 2: Property List
  { id: 'has_house', moduleId: 2, moduleName: '财产清单', question: '是否有房产待分割', type: 'radio', options: ['是', '否'], required: true },
  { id: 'house_count', moduleId: 2, moduleName: '财产清单', question: '房产数量', type: 'number', placeholder: '如：2', skipIf: { field: 'has_house', value: '否' }, required: false },
  { id: 'house_details', moduleId: 2, moduleName: '财产清单', question: '房产详情', type: 'textarea', placeholder: '如：北京市朝阳区房产，市场价500万；成都市武侯区房产，市场价200万', skipIf: { field: 'has_house', value: '否' }, required: false },
  { id: 'has_land', moduleId: 2, moduleName: '财产清单', question: '是否有宅基地/土地', type: 'radio', options: ['是', '否'], required: true },
  { id: 'has_business', moduleId: 2, moduleName: '财产清单', question: '是否有家庭企业/股权', type: 'radio', options: ['是', '否'], required: true },
  // Module 3: Division Method
  { id: 'division_method', moduleId: 3, moduleName: '分割方案', question: '分割方式', type: 'select', options: ['平均分配', '按贡献分配', '协商分配', '竞价分配'], required: true },
  { id: 'house_division', moduleId: 3, moduleName: '分割方案', question: '房产归属分配', type: 'textarea', placeholder: '如：朝阳区房产归甲方，武侯区房产归乙方', required: false },
  { id: 'cash_division', moduleId: 3, moduleName: '分割方案', question: '现金/存款分配', type: 'textarea', placeholder: '如：存款50万，甲方30万，乙方20万', required: false },
  { id: 'unequal_reason', moduleId: 3, moduleName: '分割方案', question: '如不平均分配，请说明原因', type: 'textarea', placeholder: '如：甲方对家庭贡献较大，多分20万', required: false },
  // Module 4: Rural Property
  { id: 'land_certificate', moduleId: 4, moduleName: '宅基地/农房', question: '宅基地是否有使用权证', type: 'select', options: ['有', '无', '正在办理', '不涉及'], required: true },
  { id: 'land_occupants', moduleId: 4, moduleName: '宅基地/农房', question: '宅基地上户籍人口', type: 'textarea', placeholder: '如：甲乙双方及子女共5人', skipIf: { field: 'has_land', value: '否' }, required: false },
  { id: 'farmland_arrangement', moduleId: 4, moduleName: '宅基地/农房', question: '承包地/农用地安排', type: 'select', options: ['维持现状', '重新分配', '由一方继续承包', '不涉及'], required: true },
  // Module 5: Business/Equity
  { id: 'business_name', moduleId: 5, moduleName: '企业/股权', question: '企业名称（如有）', type: 'text', placeholder: '请输入公司全称', skipIf: { field: 'has_business', value: '否' }, required: false },
  { id: 'business_division', moduleId: 5, moduleName: '企业/股权', question: '企业分割方式', type: 'select', options: ['归一方所有', '股权按比例分割', '清算分配', '不涉及'], skipIf: { field: 'has_business', value: '否' }, required: false },
  { id: 'debt_assumption', moduleId: 5, moduleName: '企业/股权', question: '企业债务承担', type: 'textarea', placeholder: '如：公司债务200万由甲方承担', skipIf: { field: 'has_business', value: '否' }, required: false },
  // Module 6: Follow-up
  { id: 'account_migration', moduleId: 6, moduleName: '后续事宜', question: '户口迁移安排', type: 'select', options: ['不需要迁移', '分家后迁移', '协商迁移'], required: true },
  { id: 'guarantee_period', moduleId: 6, moduleName: '后续事宜', question: '分家协议效力保证期', type: 'select', options: ['长期有效', '约定年限', '条件成就时失效'], required: true },
  { id: 'dispute_resolution', moduleId: 6, moduleName: '后续事宜', question: '争议解决方式', type: 'select', options: ['协商解决', '人民调解', '诉讼'], required: true },
];

// ============================================================
// 导出：根据文书类型获取对应 modules 和 questions
// ============================================================
export function getQuestionnaireByType(type: DocumentType): {
  modules: Module[];
  questions: Question[];
  title: string;
  subtitle: string;
} {
  switch (type) {
    case 'prenup':
      return { modules: prenupModules, questions: prenupQuestions, title: '婚前协议', subtitle: '明确婚前财产归属，为婚姻打下稳固基础' };
    case 'marital':
      return { modules: maritalModules, questions: maritalQuestions, title: '婚内财产约定', subtitle: '婚姻中对房产、存款、股权等做明确归属' };
    case 'divorce':
      return { modules: divorceModules, questions: divorceQuestions, title: '离婚协议', subtitle: '好聚好散，子女抚养与财产分割一次性理清' };
    case 'custody':
      return { modules: custodyModules, questions: custodyQuestions, title: '抚养权/抚养费协议', subtitle: '离婚后孩子的抚养权归属、探视规则与抚养费标准' };
    case 'guardianship':
      return { modules: guardianshipModules, questions: guardianshipQuestions, title: '意定监护协议', subtitle: '指定丧失民事行为能力时的监护人' };
    case 'donation':
      return { modules: donationModules, questions: donationQuestions, title: '财产赠与协议', subtitle: '恋爱/婚姻中对房产、车辆等大额财产的赠与' };
    case 'estate':
      return { modules: estateModules, questions: estateQuestions, title: '遗赠扶养协议', subtitle: '无子女或子女不在身边，约定由他人赡养' };
    case 'will':
      return { modules: willModules, questions: willQuestions, title: '遗嘱', subtitle: '安排您的最后遗愿，让爱延续' };
    case 'division':
      return { modules: divisionModules, questions: divisionQuestions, title: '分家析产协议', subtitle: '家庭内部房产、宅基地、家庭企业的分割' };
    default:
      return { modules: willModules, questions: willQuestions, title: '遗嘱', subtitle: '安排您的最后遗愿' };
  }
}

export function shouldSkipQuestion(question: Question, answers: Record<string, any>): boolean {
  if (!question.skipIf) return false;
  return answers[question.skipIf.field] === question.skipIf.value;
}

// 兼容旧代码：默认导出遗嘱问题集
export const modules = willModules;
export const questions = willQuestions;
