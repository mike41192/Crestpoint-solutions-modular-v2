// =====================================================
// BLOCK: Type Imports
// =====================================================

import type {
  UsageLimitStatus,
} from "./types"

// =====================================================
// BLOCK: Usage Calculator
// =====================================================

export function calculateUsageStatus(
  used: number,
  limit: number,
): UsageLimitStatus {
  const safeLimit = Math.max(limit, 1)

  const remaining =
    Math.max(limit - used, 0)

  const percentUsed =
    Math.min(
      Math.round((used / safeLimit) * 100),
      100,
    )

  return {
    used,
    limit,
    remaining,
    percentUsed,
    exceeded: used >= limit,
  }
}