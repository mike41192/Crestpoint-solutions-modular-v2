import type { MembershipTier } from "@/types/modules"

export type PricingPlan = {
  tier: MembershipTier
  name: string
  monthlyPrice: number
  yearlyPrice: number
  description: string
}

export const pricingPlans: PricingPlan[] = [
  {
    tier: "free",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Basic access for getting started.",
  },
  {
    tier: "starter",
    name: "Starter",
    monthlyPrice: 19,
    yearlyPrice: 190,
    description: "Resume tools, ATS scoring, and starter AI access.",
  },
  {
    tier: "pro",
    name: "Pro",
    monthlyPrice: 49,
    yearlyPrice: 490,
    description: "Interview prep, advanced AI tools, and career workflows.",
  },
  {
    tier: "premium",
    name: "Premium",
    monthlyPrice: 99,
    yearlyPrice: 990,
    description: "Full career operating system access.",
  },
  {
    tier: "business",
    name: "Business",
    monthlyPrice: 199,
    yearlyPrice: 1990,
    description: "Team, agency, and higher-volume access.",
  },
  {
    tier: "admin",
    name: "Admin",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Owner-only system control tier.",
  },
]