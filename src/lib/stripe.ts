import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: '2026-03-25.dahlia' })
  : null

// Price IDs from Stripe Dashboard
export const STRIPE_PRICES: Record<string, string> = {
  'ai-only': process.env.STRIPE_PRICE_AI_ONLY || 'price_ai_only_placeholder',
  'ai-lawyer': process.env.STRIPE_PRICE_AI_LAWYER || 'price_ai_lawyer_placeholder',
}

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''
