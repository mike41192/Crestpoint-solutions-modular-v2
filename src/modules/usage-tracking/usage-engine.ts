// =====================================================
// BLOCK: Type Imports
// =====================================================

import type {
  UsageLimitStatus,
} from "./types"

// =====================================================
// BLOCK: Limit Helpers
// =====================================================

function isUnlimitedLimit(limit: number): boolean {
  return limit < 0
}

// =====================================================
// BLOCK: Usage Calculator
// =====================================================

export function calculateUsageStatus(
  used: number,
  limit: number,
): UsageLimitStatus {
  if (isUnlimitedLimit(limit)) {
    return {
      used,
      limit,
      remaining: -1,
      percentUsed: 0,
      exceeded: false,
    }
  }

  const safeLimit =
    Math.max(limit, 1)

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