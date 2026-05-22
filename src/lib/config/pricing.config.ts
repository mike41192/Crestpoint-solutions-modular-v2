import type { MembershipTier } from "@/types/modules"

export type PricingPlan = {
  tier: MembershipTier
  name: string
  monthlyPrice: number
  yearlyPrice: number
  monthlyStripePriceId?: string
  yearlyStripePriceId?: string
  description: string
}

export const pricingPlans: PricingPlan[] = [
  {
    tier: "free",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyStripePriceId: undefined,
    yearlyStripePriceId: undefined,
    description: "Basic access for getting started.",
  },
  {
    tier: "starter",
    name: "Starter",
    monthlyPrice: 19,
    yearlyPrice: 190,
    monthlyStripePriceId: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID,
    yearlyStripePriceId: process.env.STRIPE_STARTER_YEARLY_PRICE_ID,
    description: "Resume tools, ATS scoring, and starter AI access.",
  },
  {
    tier: "pro",
    name: "Pro",
    monthlyPrice: 49,
    yearlyPrice: 490,
    monthlyStripePriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    yearlyStripePriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
    description: "Interview prep, advanced AI tools, and career workflows.",
  },
  {
    tier: "premium",
    name: "Premium",
    monthlyPrice: 99,
    yearlyPrice: 990,
    monthlyStripePriceId: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID,
    yearlyStripePriceId: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID,
    description: "Full career operating system access.",
  },
  {
    tier: "business",
    name: "Business",
    monthlyPrice: 199,
    yearlyPrice: 1990,
    monthlyStripePriceId: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID,
    yearlyStripePriceId: process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID,
    description: "Team, agency, and higher-volume access.",
  },
  {
    tier: "admin",
    name: "Admin",
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyStripePriceId: undefined,
    yearlyStripePriceId: undefined,
    description: "Owner-only system control tier.",
  },
]