// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { MembershipData } from "@/modules/membership-management/types"
import type { UserUsageData } from "@/modules/usage-tracking/types"

import type { FeatureAccessResult } from "./types"

// =====================================================
// BLOCK: Limit Helpers
// =====================================================

function isUnlimitedLimit(limit: number): boolean {
  return limit < 0
}

function hasReachedLimit(
  used: number,
  limit: number,
): boolean {
  if (isUnlimitedLimit(limit)) {
    return false
  }

  return used >= limit
}

// =====================================================
// BLOCK: ATS Access
// =====================================================

export function canRunATSScan(
  membership: MembershipData,
  usage: UserUsageData,
): FeatureAccessResult {
  if (
    hasReachedLimit(
      usage.atsScansUsed,
      membership.atsLimit,
    )
  ) {
    return {
      allowed: false,
      reason:
        "ATS scan limit reached. Upgrade your membership to continue running ATS scans.",
    }
  }

  return {
    allowed: true,
  }
}

// =====================================================
// BLOCK: Rewrite Access
// =====================================================

export function canRunRewrite(
  membership: MembershipData,
  usage: UserUsageData,
): FeatureAccessResult {
  if (
    hasReachedLimit(
      usage.aiRewritesUsed,
      membership.rewriteLimit,
    )
  ) {
    return {
      allowed: false,
      reason:
        "AI rewrite limit reached. Upgrade your membership to continue using AI rewrites.",
    }
  }

  return {
    allowed: true,
  }
}

// =====================================================
// BLOCK: Resume Creation Access
// =====================================================

export function canCreateResume(
  membership: MembershipData,
  usage: UserUsageData,
): FeatureAccessResult {
  if (
    hasReachedLimit(
      usage.resumesCreated,
      membership.resumeLimit,
    )
  ) {
    return {
      allowed: false,
      reason:
        "Resume limit reached. Upgrade your membership to create more resumes.",
    }
  }

  return {
    allowed: true,
  }
}

// =====================================================
// BLOCK: Tracked Job Access
// =====================================================

export function canTrackJob(
  membership: MembershipData,
  trackedJobCount: number,
): FeatureAccessResult {
  if (hasReachedLimit(trackedJobCount, membership.trackedJobsLimit)) {
    return {
      allowed: false,
      reason:
        "Tracked job limit reached. Upgrade your membership to track more applications.",
    }
  }

  return {
    allowed: true,
  }
}
