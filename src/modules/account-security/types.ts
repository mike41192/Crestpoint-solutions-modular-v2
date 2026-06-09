// =====================================================
// BLOCK: Account Security Types
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

export type AuthenticatedSessionRecord = {
  id: string
  user_id: string
  device_label: string | null
  device_type: string | null
  browser: string | null
  operating_system: string | null
  user_agent: string | null
  ip_hash: string | null
  device_fingerprint_hash: string | null
  last_seen_at: string
  revoked_at: string | null
  created_at: string
  updated_at: string
}

export type AuthenticatedSessionsResponse = {
  status: "success" | "error" | "unauthorized" | "not_found"
  message: string
  session?: AuthenticatedSessionRecord | null
  sessions?: AuthenticatedSessionRecord[]
}
