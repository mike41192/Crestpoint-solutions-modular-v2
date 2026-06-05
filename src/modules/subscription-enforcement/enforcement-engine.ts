// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { MembershipData } from "@/modules/membership-management/types"
import type { UserUsageData } from "@/modules/usage-tracking/types"

import type {
  FeatureAccessResult,
} from "./types"

// =====================================================
// BLOCK: ATS Access
// =====================================================

export function canRunATSScan(
  membership: MembershipData,
  usage: UserUsageData,
): FeatureAccessResult {
  if (
    usage.atsScansUsed >=
    membership.atsLimit
  ) {
    return {
      allowed: false,
      reason:
        "ATS scan limit reached.",
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
    usage.aiRewritesUsed >=
    membership.rewriteLimit
  ) {
    return {
      allowed: false,
      reason:
        "AI rewrite limit reached.",
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
    usage.resumesCreated >=
    membership.resumeLimit
  ) {
    return {
      allowed: false,
      reason:
        "Resume limit reached.",
    }
  }

  return {
    allowed: true,
  }
}