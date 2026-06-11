import type { MembershipTier } from "@/types/modules"

export type StripeBillingTier = Exclude<MembershipTier, "free" | "admin">
export type StripeBillingInterval = "monthly" | "yearly"

type StripePriceEnvKey =
  | "STRIPE_STARTER_MONTHLY_PRICE_ID"
  | "STRIPE_STARTER_YEARLY_PRICE_ID"
  | "STRIPE_PRO_MONTHLY_PRICE_ID"
  | "STRIPE_PRO_YEARLY_PRICE_ID"
  | "STRIPE_PREMIUM_MONTHLY_PRICE_ID"
  | "STRIPE_PREMIUM_YEARLY_PRICE_ID"
  | "STRIPE_BUSINESS_MONTHLY_PRICE_ID"
  | "STRIPE_BUSINESS_YEARLY_PRICE_ID"

type StripeProductEnvKey =
  | "STRIPE_STARTER_PRODUCT_ID"
  | "STRIPE_PRO_PRODUCT_ID"
  | "STRIPE_PREMIUM_PRODUCT_ID"
  | "STRIPE_BUSINESS_PRODUCT_ID"

type StripeCoreEnvKey =
  | "STRIPE_SECRET_KEY"
  | "STRIPE_WEBHOOK_SECRET"
  | "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"

const coreStripeEnvKeys: StripeCoreEnvKey[] = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
]

const stripeBillingTiers: StripeBillingTier[] = [
  "starter",
  "pro",
  "premium",
  "business",
]

const stripeBillingIntervals: StripeBillingInterval[] = ["monthly", "yearly"]

const stripePriceEnvKeys: Record<
  StripeBillingTier,
  Record<StripeBillingInterval, StripePriceEnvKey>
> = {
  starter: {
    monthly: "STRIPE_STARTER_MONTHLY_PRICE_ID",
    yearly: "STRIPE_STARTER_YEARLY_PRICE_ID",
  },
  pro: {
    monthly: "STRIPE_PRO_MONTHLY_PRICE_ID",
    yearly: "STRIPE_PRO_YEARLY_PRICE_ID",
  },
  premium: {
    monthly: "STRIPE_PREMIUM_MONTHLY_PRICE_ID",
    yearly: "STRIPE_PREMIUM_YEARLY_PRICE_ID",
  },
  business: {
    monthly: "STRIPE_BUSINESS_MONTHLY_PRICE_ID",
    yearly: "STRIPE_BUSINESS_YEARLY_PRICE_ID",
  },
}

const stripeProductEnvKeys: Record<StripeBillingTier, StripeProductEnvKey> = {
  starter: "STRIPE_STARTER_PRODUCT_ID",
  pro: "STRIPE_PRO_PRODUCT_ID",
  premium: "STRIPE_PREMIUM_PRODUCT_ID",
  business: "STRIPE_BUSINESS_PRODUCT_ID",
}

function readEnv(key: string) {
  return process.env[key]?.trim() || ""
}

export function getStripeSecretKey() {
  return readEnv("STRIPE_SECRET_KEY")
}

export function getStripeWebhookSecret() {
  return readEnv("STRIPE_WEBHOOK_SECRET")
}

export function getStripePublishableKey() {
  return readEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")
}

export function getStripeBillingTiers() {
  return stripeBillingTiers
}

export function getStripeBillingIntervals() {
  return stripeBillingIntervals
}

export function isStripeBillingTier(
  value: unknown,
): value is StripeBillingTier {
  return (
    typeof value === "string" &&
    stripeBillingTiers.includes(value as StripeBillingTier)
  )
}

export function isStripeBillingInterval(
  value: unknown,
): value is StripeBillingInterval {
  return (
    typeof value === "string" &&
    stripeBillingIntervals.includes(value as StripeBillingInterval)
  )
}

export function getStripePriceEnvKey(
  tier: StripeBillingTier,
  interval: StripeBillingInterval,
) {
  return stripePriceEnvKeys[tier][interval]
}

export function getStripePriceId(
  tier: StripeBillingTier,
  interval: StripeBillingInterval,
) {
  return readEnv(getStripePriceEnvKey(tier, interval))
}

export function getStripeProductEnvKey(tier: StripeBillingTier) {
  return stripeProductEnvKeys[tier]
}

export function getStripeProductId(tier: StripeBillingTier) {
  return readEnv(getStripeProductEnvKey(tier))
}

export function getStripeTierForPriceId(priceId: string | null | undefined) {
  if (!priceId) {
    return null
  }

  for (const tier of stripeBillingTiers) {
    for (const interval of stripeBillingIntervals) {
      if (getStripePriceId(tier, interval) === priceId) {
        return tier
      }
    }
  }

  return null
}

export function getStripeIntervalForPriceId(
  priceId: string | null | undefined,
) {
  if (!priceId) {
    return null
  }

  for (const tier of stripeBillingTiers) {
    for (const interval of stripeBillingIntervals) {
      if (getStripePriceId(tier, interval) === priceId) {
        return interval
      }
    }
  }

  return null
}

export function getMissingStripeEnvKeys() {
  const priceKeys = stripeBillingTiers.flatMap((tier) =>
    stripeBillingIntervals.map((interval) =>
      getStripePriceEnvKey(tier, interval),
    ),
  )

  return [...coreStripeEnvKeys, ...priceKeys].filter((key) => !readEnv(key))
}

export function isStripeConfigured() {
  return getMissingStripeEnvKeys().length === 0
}

export function isStripeCoreConfigured() {
  return coreStripeEnvKeys.every((key) => readEnv(key))
}

export function getStripeBillingEnvStatus() {
  return {
    core: {
      secretKey: Boolean(getStripeSecretKey()),
      webhookSecret: Boolean(getStripeWebhookSecret()),
      publishableKey: Boolean(getStripePublishableKey()),
    },
    prices: stripeBillingTiers.map((tier) => ({
      tier,
      productEnvKey: getStripeProductEnvKey(tier),
      productConfigured: Boolean(getStripeProductId(tier)),
      monthlyEnvKey: getStripePriceEnvKey(tier, "monthly"),
      monthlyConfigured: Boolean(getStripePriceId(tier, "monthly")),
      yearlyEnvKey: getStripePriceEnvKey(tier, "yearly"),
      yearlyConfigured: Boolean(getStripePriceId(tier, "yearly")),
    })),
  }
}
