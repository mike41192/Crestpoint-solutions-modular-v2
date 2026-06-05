// =====================================================
// BLOCK: Usage Tracking Types
// Crestpoint Solutions V2
// Version: 1.7.9
// =====================================================

export type UserUsageData = {
  atsScansUsed: number
  aiRewritesUsed: number
  resumesCreated: number
}

export type UsageLimitStatus = {
  used: number
  limit: number
  remaining: number
  percentUsed: number
  exceeded: boolean
}