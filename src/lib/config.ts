// MiniMax API Configuration
export const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || '';
export const MINIMAX_BASE_URL = process.env.MINIMAX_BASE_URL || 'https://api.minimaxi.com/anthropic';
export const MINIMAX_MODEL = process.env.MINIMAX_MODEL || 'MiniMax-M2';

// Pricing Tiers
export const PRICING_TIERS = [
  {
    id: 'limited',
    name: 'AI体验版',
    tagline: '快速入门',
    originalPrice: 49,
    price: 29.9,
    description: '9类文书均可使用，限时特惠',
    features: [
      '9类文书任选',
      'AI智能问卷引导',
      '生成专属文书草稿',
      'PDF下载',
    ],
    cta: '立即体验',
  },
  {
    id: 'ai-only',
    name: '专业版',
    tagline: '30分钟，AI帮您完成规划',
    originalPrice: 299,
    price: 199,
    description: 'AI智能生成文书草稿',
    features: [
      '9大模块智能问卷',
      'AI生成文书草稿',
      '永久保存，随时修改',
      'PDF下载',
    ],
    cta: '选择专业版',
  },
  {
    id: 'ai-lawyer',
    name: '尊享护航版',
    tagline: '专家1对1审核',
    originalPrice: 999,
    price: 699,
    description: 'AI+专家审核签署',
    recommended: true,
    features: [
      'AI智能问卷全程引导',
      '专家视频审核',
      '文书效力保障',
      '30天修改有效期',
    ],
    cta: '选择尊享护航版',
  },

];

// Document Types
export const DOCUMENT_TYPES = [
  { id: 'prenup', name: '婚前协议', icon: '💍' },
  { id: 'marital', name: '婚内财产约定', icon: '🏠' },
  { id: 'gift', name: '赠与协议', icon: '🎁' },
  { id: 'custody', name: '抚养协议', icon: '👶' },
  { id: 'divorce', name: '离婚协议', icon: '💔' },
  { id: 'division', name: '分家协议', icon: '🏡' },
  { id: 'estate', name: '遗赠扶养协议', icon: '🧓' },
  { id: 'guardianship', name: '意定监护', icon: '🛡️' },
      { id: 'will', name: '财产传承安排', icon: '📜' },
];

// Platform Fee
export const PLATFORM_FEE_RATIO = 0.15; // 15% platform fee
