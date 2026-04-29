// MiniMax API Configuration
export const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || '';
export const MINIMAX_BASE_URL = process.env.MINIMAX_BASE_URL || 'https://api.minimaxi.com/anthropic';
export const MINIMAX_MODEL = process.env.MINIMAX_MODEL || 'MiniMax-M2';

// Pricing Tiers
export const PRICING_TIERS = [
  {
    id: 'limited',
    name: '限时活动版',
    tagline: '限首次体验',
    price: 29.9,
    description: '9类文书均可使用，限时特惠',
    recommended: true,
    features: [
      '9类文书任选',
      'AI智能问卷引导',
      '生成专属文书草稿',
      'PDF下载',
      '24h律师审核（可选）',
    ],
  },
  {
    id: 'ai-only',
    name: 'AI专属版',
    tagline: '30分钟，AI帮您完成规划',
    price: 199,
    description: 'AI智能生成文书草稿',
    features: [
      '9大模块智能问卷',
      'AI生成文书草稿',
      '永久保存，随时修改',
      'PDF下载',
    ],
  },
  {
    id: 'ai-lawyer',
    name: '律师护航版',
    price: 699,
    description: 'AI+律师专业审核',
    recommended: true,
    features: [
      'AI智能问卷全程引导',
      '专业律师审核修订',
      '法律效力保障',
      '无限次修改',
      '优先预约律师',
    ],
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
  { id: 'will', name: '遗嘱', icon: '📜' },
];

// Platform Fee
export const PLATFORM_FEE_RATIO = 0.15; // 15% platform fee
