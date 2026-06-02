// =====================================================
// BLOCK: Supabase Server Imports
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: Resume Delete Route
// =====================================================

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const resumeId = body?.resumeId

    if (!resumeId || typeof resumeId !== "string") {
      return Response.json(
        {
          status: "error",
          message: "Resume ID is required.",
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
          message: "You must be signed in to delete resumes.",
        },
        { status: 401 },
      )
    }

    const { data, error } = await supabase
      .from("resumes")
      .delete()
      .eq("id", resumeId)
      .eq("user_id", user.id)
      .select("id")
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
          status: "error",
          message: "Resume not found or access denied.",
        },
        { status: 404 },
      )
    }

    return Response.json({
      status: "success",
      message: "Resume deleted.",
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Delete resume request failed.",
      },
      { status: 500 },
    )
  }
}
