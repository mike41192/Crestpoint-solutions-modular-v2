// =====================================================
// BLOCK: Supabase Server Imports
// Crestpoint Solutions V2
// Version: 1.9.0
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: Helpers
// =====================================================

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function cleanStatus(value: unknown) {
  const allowed = [
    "saved",
    "applied",
    "follow_up",
    "interviewing",
    "offer",
    "rejected",
    "archived",
  ]

  return typeof value === "string" && allowed.includes(value)
    ? value
    : null
}

// =====================================================
// BLOCK: Update Job Application Status Route
// =====================================================

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const id = cleanText(body?.id)
    const status = cleanStatus(body?.status)

    if (!id || !status) {
      return Response.json(
        {
          status: "error",
          message: "Job application ID and valid status are required.",
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
          message: "You must be signed in to update job status.",
        },
        { status: 401 },
      )
    }

    const { data, error } = await supabase
      .from("job_applications")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select("*")
      .maybeSingle()

    if (error) {
      return Response.json(
        {
          status: "error",
          message: error.message,
        },
        { status: 500 },
      )
    }

    if (!data) {
      return Response.json(
        {
          status: "not_found",
          message: "Job application not found or access denied.",
        },
        { status: 404 },
      )
    }

    return Response.json({
      status: "success",
      message: "Job status updated.",
      application: data,
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Update job status request failed.",
      },
      { status: 500 },
    )
  }
}