// =====================================================
// BLOCK: Supabase Imports
// =====================================================

import { createSupabaseBrowserClient } from "@/lib/supabase/client"

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
  const supabase = createSupabaseBrowserClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return createEmptyUsage()
  }

  const { data } = await supabase
    .from("user_usage")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!data) {
    return createEmptyUsage()
  }

  return {
    atsScansUsed: data.ats_scans_used,
    aiRewritesUsed: data.ai_rewrites_used,
    resumesCreated: data.resumes_created,
  }
}