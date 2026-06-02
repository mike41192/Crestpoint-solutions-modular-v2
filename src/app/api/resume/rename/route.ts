// =====================================================
// BLOCK: Supabase Server Imports
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: Constants
// =====================================================

const MAX_RESUME_TITLE_LENGTH = 120

// =====================================================
// BLOCK: Resume Rename Route
// =====================================================

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const resumeId = body?.resumeId
    const title = typeof body?.title === "string" ? body.title.trim() : ""

    if (!resumeId || typeof resumeId !== "string") {
      return Response.json(
        {
          status: "error",
          message: "Resume ID is required.",
        },
        { status: 400 },
      )
    }

    if (!title) {
      return Response.json(
        {
          status: "error",
          message: "Resume title is required.",
        },
        { status: 400 },
      )
    }

    if (title.length > MAX_RESUME_TITLE_LENGTH) {
      return Response.json(
        {
          status: "error",
          message: `Resume title must be ${MAX_RESUME_TITLE_LENGTH} characters or fewer.`,
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
          message: "You must be signed in to rename resumes.",
        },
        { status: 401 },
      )
    }

    const { data, error } = await supabase
      .from("resumes")
      .update({
        title,
      })
      .eq("id", resumeId)
      .eq("user_id", user.id)
      .select()
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
      message: "Resume renamed.",
      resume: data,
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Rename resume request failed.",
      },
      { status: 500 },
    )
  }
}
