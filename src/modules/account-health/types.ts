// =====================================================
// BLOCK: Account Health Types
// =====================================================

export type AccountHealthCheck = {
  label: string
  completed: boolean
}

export type AccountHealthReport = {
  score: number
  checks: AccountHealthCheck[]
}