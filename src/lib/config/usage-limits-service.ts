import {
  createMembershipLimitSnapshot,
  getUsageLimitsForTier,
  normalizeMembershipTier,
  usageLimits,
  type MembershipLimitSnapshot,
  type TierUsageLimits,
} from "@/lib/config/limits.config"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import type { MembershipTier } from "@/types/modules"

type MembershipTierLimitRow = {
  tier: string
  ai_credits_per_month: number | null
  resume_uploads_per_month: number | null
  resume_exports_per_month: number | null
  ats_scans_per_month: number | null
  mock_interviews_per_month: number | null
  tracked_jobs: number | null
}

function rowToUsageLimits(row: MembershipTierLimitRow): TierUsageLimits {
  const tier = normalizeMembershipTier(row.tier)
  const fallback = getUsageLimitsForTier(tier)

  return {
    tier,
    aiCreditsPerMonth: Number(
      row.ai_credits_per_month ?? fallback.aiCreditsPerMonth,
    ),
    resumeUploadsPerMonth: Number(
      row.resume_uploads_per_month ?? fallback.resumeUploadsPerMonth,
    ),
    resumeExportsPerMonth: Number(
      row.resume_exports_per_month ?? fallback.resumeExportsPerMonth,
    ),
    atsScansPerMonth: Number(
      row.ats_scans_per_month ?? fallback.atsScansPerMonth,
    ),
    mockInterviewsPerMonth: Number(
      row.mock_interviews_per_month ?? fallback.mockInterviewsPerMonth,
    ),
    trackedJobs: Number(row.tracked_jobs ?? fallback.trackedJobs),
  }
}

export async function loadEditableUsageLimits(): Promise<TierUsageLimits[]> {
  try {
    const supabase = createSupabaseAdminClient()

    const { data, error } = await supabase
      .from("membership_tier_limits")
      .select(
        "tier, ai_credits_per_month, resume_uploads_per_month, resume_exports_per_month, ats_scans_per_month, mock_interviews_per_month, tracked_jobs",
      )

    if (error || !data?.length) {
      return usageLimits
    }

    const loadedByTier = new Map<MembershipTier, TierUsageLimits>()

    data.forEach((row) => {
      const limits = rowToUsageLimits(row)
      loadedByTier.set(limits.tier, limits)
    })

    return usageLimits.map((fallback) => loadedByTier.get(fallback.tier) || fallback)
  } catch {
    return usageLimits
  }
}

export async function loadEditableUsageLimitsForTier(
  tier: MembershipTier,
): Promise<TierUsageLimits> {
  const limits = await loadEditableUsageLimits()

  return (
    limits.find((item) => item.tier === tier) ||
    getUsageLimitsForTier(tier)
  )
}

export async function loadMembershipLimitSnapshotForPlan(
  planName: string | null | undefined,
): Promise<MembershipLimitSnapshot> {
  const tier = normalizeMembershipTier(planName)
  const limits = await loadEditableUsageLimitsForTier(tier)
  const fallback = createMembershipLimitSnapshot(tier)

  return {
    ...fallback,
    atsLimit: limits.atsScansPerMonth,
    rewriteLimit: limits.aiCreditsPerMonth,
    resumeLimit: limits.resumeUploadsPerMonth,
    trackedJobsLimit: limits.trackedJobs,
    mockInterviewLimit: limits.mockInterviewsPerMonth,
  }
}
