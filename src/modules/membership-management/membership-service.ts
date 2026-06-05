// =====================================================
// BLOCK: Supabase Imports
// =====================================================

import { createSupabaseBrowserClient } from "@/lib/supabase/client"

// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { MembershipData } from "./types"

// =====================================================
// BLOCK: Empty Membership
// =====================================================

export function createEmptyMembership(): MembershipData {
  return {
    planName: "Free",
    status: "Active",

    atsLimit: 10,
    rewriteLimit: 5,
    resumeLimit: 3,
  }
}

// =====================================================
// BLOCK: Load Membership
// =====================================================

export async function loadCurrentMembership(): Promise<MembershipData> {
  const supabase = createSupabaseBrowserClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return createEmptyMembership()
  }

  const { data } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()

  if (!data) {
    return createEmptyMembership()
  }

  return {
    planName: data.plan_name,
    status: data.status,

    atsLimit: data.ats_limit,
    rewriteLimit: data.rewrite_limit,
    resumeLimit: data.resume_limit,
  }
}