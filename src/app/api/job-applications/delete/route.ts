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

// =====================================================
// BLOCK: Delete Job Application Route
// =====================================================

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const id = cleanText(body?.id)

    if (!id) {
      return Response.json(
        {
          status: "error",
          message: "Job application ID is required.",
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
          message: "You must be signed in to delete job applications.",
        },
        { status: 401 },
      )
    }

    const { error } = await supabase
      .from("job_applications")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) {
      return Response.json(
        {
          status: "error",
          message: error.message,
        },
        { status: 500 },
      )
    }

    return Response.json({
      status: "success",
      message: "Job application deleted.",
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Delete job application request failed.",
      },
      { status: 500 },
    )
  }
}
