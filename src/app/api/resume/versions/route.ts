// =====================================================
// BLOCK: Supabase Server Imports
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: Resume Versions Route
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
          versions: [],
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
          message: "You must be signed in to view resume versions.",
          versions: [],
        },
        { status: 401 },
      )
    }

    const { data: ownedResume, error: resumeError } = await supabase
      .from("resumes")
      .select("id")
      .eq("id", resumeId)
      .eq("user_id", user.id)
      .maybeSingle()

    if (resumeError) {
      return Response.json(
        {
          status: "error",
          message: resumeError.message,
          versions: [],
        },
        { status: 500 },
      )
    }

    if (!ownedResume) {
      return Response.json(
        {
          status: "error",
          message: "Resume not found or access denied.",
          versions: [],
        },
        { status: 404 },
      )
    }

    const { data, error } = await supabase
      .from("resume_versions")
      .select("*")
      .eq("resume_id", resumeId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return Response.json(
        {
          status: "error",
          message: error.message,
          versions: [],
        },
        { status: 500 },
      )
    }

    return Response.json({
      status: "success",
      message: "Resume versions loaded.",
      versions: data || [],
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Resume versions request failed.",
        versions: [],
      },
      { status: 500 },
    )
  }
}
