// =====================================================
// BLOCK: Supabase Server Imports
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: Usage Action Types
// =====================================================

type UsageColumn =
  | "ats_scans_used"
  | "ai_rewrites_used"
  | "resumes_created"

const ALLOWED_USAGE_COLUMNS: UsageColumn[] = [
  "ats_scans_used",
  "ai_rewrites_used",
  "resumes_created",
]

// =====================================================
// BLOCK: Validation Helpers
// =====================================================

function isAllowedUsageColumn(value: unknown): value is UsageColumn {
  return (
    typeof value === "string" &&
    ALLOWED_USAGE_COLUMNS.includes(value as UsageColumn)
  )
}

// =====================================================
// BLOCK: Ensure Usage Row Exists
// =====================================================

async function ensureUsageRow(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
) {
  const { error } = await supabase.from("user_usage").upsert({
    user_id: userId,
    ats_scans_used: 0,
    ai_rewrites_used: 0,
    resumes_created: 0,
  })

  if (error) {
    throw new Error(error.message)
  }
}

// =====================================================
// BLOCK: Increment Usage Route
// =====================================================

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const column = body?.column

    if (!isAllowedUsageColumn(column)) {
      return Response.json(
        {
          status: "error",
          message: "Invalid usage column.",
        },
        { status: 400 },
      )
    }

    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return Response.json(
        {
          status: "unauthorized",
          message: "You must be signed in to update usage.",
        },
        { status: 401 },
      )
    }

    await ensureUsageRow(supabase, user.id)

    const { data: currentRow, error: loadError } = await supabase
      .from("user_usage")
      .select("user_id, ats_scans_used, ai_rewrites_used, resumes_created")
      .eq("user_id", user.id)
      .maybeSingle()

    if (loadError) {
      return Response.json(
        {
          status: "error",
          message: loadError.message,
          debugUserId: user.id,
        },
        { status: 500 },
      )
    }

    if (!currentRow) {
      return Response.json(
        {
          status: "error",
          message: "Usage row could not be loaded after creation.",
          debugUserId: user.id,
        },
        { status: 500 },
      )
    }

    const currentValue = Number(currentRow[column] ?? 0)
    const nextValue = currentValue + 1

    const { data: updatedRows, error: updateError } = await supabase
      .from("user_usage")
      .update({
        [column]: nextValue,
      })
      .eq("user_id", user.id)
      .select("user_id, ats_scans_used, ai_rewrites_used, resumes_created")

    if (updateError) {
      return Response.json(
        {
          status: "error",
          message: updateError.message,
          debugUserId: user.id,
          column,
          currentValue,
          nextValue,
        },
        { status: 500 },
      )
    }

    if (!updatedRows || updatedRows.length === 0) {
      return Response.json(
        {
          status: "error",
          message: "Usage update did not affect any rows.",
          debugUserId: user.id,
          column,
          currentValue,
          nextValue,
        },
        { status: 500 },
      )
    }

    return Response.json({
      status: "success",
      message: "Usage updated.",
      column,
      previousValue: currentValue,
      value: nextValue,
      usage: {
        atsScansUsed: Number(updatedRows[0].ats_scans_used ?? 0),
        aiRewritesUsed: Number(updatedRows[0].ai_rewrites_used ?? 0),
        resumesCreated: Number(updatedRows[0].resumes_created ?? 0),
      },
      debugUserId: user.id,
    })
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Usage update request failed.",
      },
      { status: 500 },
    )
  }
}