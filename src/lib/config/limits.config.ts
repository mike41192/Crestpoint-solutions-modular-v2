import type { MembershipTier } from "@/types/modules"

export type TierUsageLimits = {
  tier: MembershipTier
  aiCreditsPerMonth: number
  resumeUploadsPerMonth: number
  resumeExportsPerMonth: number
  atsScansPerMonth: number
  mockInterviewsPerMonth: number
  trackedJobs: number
}

export const usageLimits: TierUsageLimits[] = [
  {
    tier: "free",
    aiCreditsPerMonth: 10,
    resumeUploadsPerMonth: 1,
    resumeExportsPerMonth: 1,
    atsScansPerMonth: 1,
    mockInterviewsPerMonth: 0,
    trackedJobs: 5,
  },
  {
    tier: "starter",
    aiCreditsPerMonth: 100,
    resumeUploadsPerMonth: 10,
    resumeExportsPerMonth: 10,
    atsScansPerMonth: 20,
    mockInterviewsPerMonth: 2,
    trackedJobs: 25,
  },
  {
    tier: "pro",
    aiCreditsPerMonth: 500,
    resumeUploadsPerMonth: 50,
    resumeExportsPerMonth: 50,
    atsScansPerMonth: 100,
    mockInterviewsPerMonth: 20,
    trackedJobs: 100,
  },
  {
    tier: "premium",
    aiCreditsPerMonth: 1500,
    resumeUploadsPerMonth: 150,
    resumeExportsPerMonth: 150,
    atsScansPerMonth: 300,
    mockInterviewsPerMonth: 100,
    trackedJobs: 500,
  },
  {
    tier: "business",
    aiCreditsPerMonth: 5000,
    resumeUploadsPerMonth: 500,
    resumeExportsPerMonth: 500,
    atsScansPerMonth: 1000,
    mockInterviewsPerMonth: 300,
    trackedJobs: 2500,
  },
  {
    tier: "admin",
    aiCreditsPerMonth: -1,
    resumeUploadsPerMonth: -1,
    resumeExportsPerMonth: -1,
    atsScansPerMonth: -1,
    mockInterviewsPerMonth: -1,
    trackedJobs: -1,
  },
]

export type MembershipLimitSnapshot = {
  planName: string
  atsLimit: number
  rewriteLimit: number
  resumeLimit: number
  trackedJobsLimit: number
  mockInterviewLimit: number
}

export function normalizeMembershipTier(
  value: string | null | undefined,
): MembershipTier {
  const normalized = (value || "free").toLowerCase().trim()

  if (
    normalized === "starter" ||
    normalized === "pro" ||
    normalized === "premium" ||
    normalized === "business" ||
    normalized === "admin"
  ) {
    return normalized
  }

  return "free"
}

export function formatMembershipTierName(tier: MembershipTier) {
  return tier.charAt(0).toUpperCase() + tier.slice(1)
}

export function getUsageLimitsForTier(tier: MembershipTier) {
  return (
    usageLimits.find((limits) => limits.tier === tier) ||
    usageLimits.find((limits) => limits.tier === "free") ||
    usageLimits[0]
  )
}

export function createMembershipLimitSnapshot(
  tier: MembershipTier,
): MembershipLimitSnapshot {
  const limits = getUsageLimitsForTier(tier)

  return {
    planName: formatMembershipTierName(tier),
    atsLimit: limits.atsScansPerMonth,
    rewriteLimit: limits.aiCreditsPerMonth,
    resumeLimit: limits.resumeUploadsPerMonth,
    trackedJobsLimit: limits.trackedJobs,
    mockInterviewLimit: limits.mockInterviewsPerMonth,
  }
}

export function createMembershipLimitSnapshotFromPlan(
  planName: string | null | undefined,
) {
  return createMembershipLimitSnapshot(normalizeMembershipTier(planName))
}

export function isUnlimitedLimit(limit: number) {
  return limit < 0
}

export function hasReachedUsageLimit(used: number, limit: number) {
  if (isUnlimitedLimit(limit)) {
    return false
  }

  return used >= limit
}
