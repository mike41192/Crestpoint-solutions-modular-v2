// =====================================================
// BLOCK: Supabase Server Imports
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: Empty Usage Factory
// =====================================================

function createEmptyUsage() {
  return {
    atsScansUsed: 0,
    aiRewritesUsed: 0,
    resumesCreated: 0,
  }
}

// =====================================================
// BLOCK: Ensure Usage Row Exists
// =====================================================

async function ensureUsageRow(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
) {
  await supabase.from("user_usage").upsert({
    user_id: userId,
    ats_scans_used: 0,
    ai_rewrites_used: 0,
    resumes_created: 0,
  })
}

// =====================================================
// BLOCK: User Usage Route
// =====================================================

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return Response.json(
        {
          status: "unauthorized",
          message: "You must be signed in to load usage.",
          usage: createEmptyUsage(),
        },
        { status: 401 },
      )
    }

    await ensureUsageRow(supabase, user.id)

    const { data, error } = await supabase
      .from("user_usage")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()

    if (error) {
      return Response.json(
        {
          status: "error",
          message: error.message,
          usage: createEmptyUsage(),
        },
        { status: 500 },
      )
    }

    if (!data) {
      return Response.json({
        status: "success",
        message: "No usage row found.",
        usage: createEmptyUsage(),
      })
    }

    return Response.json({
      status: "success",
      message: "Usage loaded.",
      usage: {
        atsScansUsed: Number(data.ats_scans_used ?? 0),
        aiRewritesUsed: Number(data.ai_rewrites_used ?? 0),
        resumesCreated: Number(data.resumes_created ?? 0),
      },
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Usage request failed.",
        usage: createEmptyUsage(),
      },
      { status: 500 },
    )
  }
}
