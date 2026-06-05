// =====================================================
// BLOCK: Supabase Imports
// Crestpoint Solutions V2
// Version: 1.7.11
// =====================================================

import { createSupabaseBrowserClient } from "@/lib/supabase/client"

// =====================================================
// BLOCK: Usage Action Types
// =====================================================

type UsageColumn =
  | "ats_scans_used"
  | "ai_rewrites_used"
  | "resumes_created"

type UsageActionResult = {
  status: "success" | "error"
  message: string
}

// =====================================================
// BLOCK: Current User Helper
// =====================================================

async function getCurrentUserId() {
  const supabase = createSupabaseBrowserClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user.id
}

// =====================================================
// BLOCK: Ensure Usage Row Exists
// =====================================================

async function ensureUsageRow(userId: string) {
  const supabase = createSupabaseBrowserClient()

  await supabase.from("user_usage").upsert({
    user_id: userId,
  })
}

// =====================================================
// BLOCK: Increment Usage Column
// =====================================================

async function incrementUsageColumn(
  column: UsageColumn,
): Promise<UsageActionResult> {
  const supabase = createSupabaseBrowserClient()
  const userId = await getCurrentUserId()

  if (!userId) {
    return {
      status: "error",
      message: "You must be signed in to track usage.",
    }
  }

  await ensureUsageRow(userId)

  const { data, error: loadError } = await supabase
    .from("user_usage")
    .select(column)
    .eq("user_id", userId)
    .maybeSingle()

  if (loadError) {
    return {
      status: "error",
      message: loadError.message,
    }
  }

  const currentValue = Number(data?.[column] || 0)

  const { error: updateError } = await supabase
    .from("user_usage")
    .update({
      [column]: currentValue + 1,
    })
    .eq("user_id", userId)

  if (updateError) {
    return {
      status: "error",
      message: updateError.message,
    }
  }

  return {
    status: "success",
    message: "Usage updated.",
  }
}

// =====================================================
// BLOCK: Public Usage Actions
// =====================================================

export function incrementATSScan() {
  return incrementUsageColumn("ats_scans_used")
}

export function incrementAIRewrite() {
  return incrementUsageColumn("ai_rewrites_used")
}

export function incrementResumeCreated() {
  return incrementUsageColumn("resumes_created")
}
