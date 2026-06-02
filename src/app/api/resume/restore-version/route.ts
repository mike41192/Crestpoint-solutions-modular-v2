// =====================================================
// BLOCK: Supabase Server Imports
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: Resume Version Restore Route
// =====================================================

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const versionId = body?.versionId

    if (!versionId || typeof versionId !== "string") {
      return Response.json(
        {
          status: "error",
          message: "Version ID is required.",
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
          message: "You must be signed in to restore resume versions.",
        },
        { status: 401 },
      )
    }

    const { data: version, error: versionError } = await supabase
      .from("resume_versions")
      .select("*")
      .eq("id", versionId)
      .eq("user_id", user.id)
      .maybeSingle()

    if (versionError) {
      return Response.json(
        {
          status: "error",
          message: versionError.message,
        },
        { status: 500 },
      )
    }

    if (!version) {
      return Response.json(
        {
          status: "error",
          message: "Resume version not found or access denied.",
        },
        { status: 404 },
      )
    }

    const { data: restoredResume, error: restoreError } = await supabase
      .from("resumes")
      .update({
        resume_data: version.resume_data,
        selected_template: version.selected_template,
        status: "draft",
      })
      .eq("id", version.resume_id)
      .eq("user_id", user.id)
      .select()
      .maybeSingle()

    if (restoreError) {
      return Response.json(
        {
          status: "error",
          message: restoreError.message,
        },
        { status: 500 },
      )
    }

    if (!restoredResume) {
      return Response.json(
        {
          status: "error",
          message: "Resume not found or access denied.",
        },
        { status: 404 },
      )
    }

    await supabase.from("resume_versions").insert({
      resume_id: restoredResume.id,
      user_id: user.id,
      version_label: "Restored Version",
      selected_template: restoredResume.selected_template,
      resume_data: restoredResume.resume_data,
    })

    return Response.json({
      status: "success",
      message: "Resume version restored.",
      resume: restoredResume,
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Restore version request failed.",
      },
      { status: 500 },
    )
  }
}
