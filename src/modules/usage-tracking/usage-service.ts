// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { UserUsageData } from "./types"

// =====================================================
// BLOCK: Empty Usage Factory
// =====================================================

export function createEmptyUsage(): UserUsageData {
  return {
    atsScansUsed: 0,
    aiRewritesUsed: 0,
    resumesCreated: 0,
  }
}

// =====================================================
// BLOCK: Load Current Usage
// =====================================================

export async function loadCurrentUsage(): Promise<UserUsageData> {
  try {
    const response = await fetch("/api/user/usage", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const result = await response.json()

    if (!response.ok || result.status !== "success") {
      return createEmptyUsage()
    }

    return {
      atsScansUsed: Number(result.usage?.atsScansUsed ?? 0),
      aiRewritesUsed: Number(result.usage?.aiRewritesUsed ?? 0),
      resumesCreated: Number(result.usage?.resumesCreated ?? 0),
    }
  } catch {
    return createEmptyUsage()
  }
}