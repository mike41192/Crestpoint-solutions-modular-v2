import type { MembershipTier } from "@/types/modules"

export const membershipTiers: MembershipTier[] = [
  "free",
  "starter",
  "pro",
  "premium",
  "business",
  "admin",
]

export const tierRank: Record<MembershipTier, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  premium: 3,
  business: 4,
  admin: 99,
}