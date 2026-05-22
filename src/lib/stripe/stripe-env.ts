const requiredStripeEnvKeys = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_STARTER_MONTHLY_PRICE_ID",
  "STRIPE_STARTER_YEARLY_PRICE_ID",
  "STRIPE_PRO_MONTHLY_PRICE_ID",
  "STRIPE_PRO_YEARLY_PRICE_ID",
  "STRIPE_PREMIUM_MONTHLY_PRICE_ID",
  "STRIPE_PREMIUM_YEARLY_PRICE_ID",
  "STRIPE_BUSINESS_MONTHLY_PRICE_ID",
  "STRIPE_BUSINESS_YEARLY_PRICE_ID",
] as const

export function getMissingStripeEnvKeys() {
  return requiredStripeEnvKeys.filter((key) => !process.env[key])
}

export function isStripeConfigured() {
  return getMissingStripeEnvKeys().length === 0
}