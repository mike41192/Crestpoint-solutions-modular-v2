// =====================================================
// BLOCK: Type Imports
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import { createMembershipLimitSnapshot } from "@/lib/config/limits.config"
import type { MembershipData } from "./types"

// =====================================================
// BLOCK: Empty Membership
// =====================================================

export function createEmptyMembership(): MembershipData {
  const limits = createMembershipLimitSnapshot("free")

  return {
    planName: limits.planName,
    status: "Active",
    atsLimit: limits.atsLimit,
    rewriteLimit: limits.rewriteLimit,
    resumeLimit: limits.resumeLimit,
    trackedJobsLimit: limits.trackedJobsLimit,
    mockInterviewLimit: limits.mockInterviewLimit,
  }
}

// =====================================================
// BLOCK: Load Membership
// =====================================================

export async function loadCurrentMembership(): Promise<MembershipData> {
  try {
    const response = await fetch("/api/user/membership", {
      method: "GET",
      cache: "no-store",
    })

    const result = await response.json()

    if (!response.ok || !result?.membership) {
      return createEmptyMembership()
    }

    return {
      planName: result.membership.planName || "Free",
      status: result.membership.status || "Active",
      atsLimit: Number(result.membership.atsLimit ?? 10),
      rewriteLimit: Number(result.membership.rewriteLimit ?? 5),
      resumeLimit: Number(result.membership.resumeLimit ?? 3),
      trackedJobsLimit: Number(result.membership.trackedJobsLimit ?? 5),
      mockInterviewLimit: Number(result.membership.mockInterviewLimit ?? 0),
    }
  } catch {
    return createEmptyMembership()
  }
}
