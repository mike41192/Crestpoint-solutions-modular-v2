// =====================================================
// BLOCK: Supabase Server Imports
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: Local Types
// =====================================================

type ResumeSaveRequestBody = {
  resumeId?: unknown
  resumeData?: unknown
  selectedTemplate?: unknown
  title?: unknown
  status?: unknown
}

// =====================================================
// BLOCK: Validation Helpers
// =====================================================

function getStringValue(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : fallback
}

function getOptionalStringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

// =====================================================
// BLOCK: Resume Save Route
// =====================================================

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ResumeSaveRequestBody

    const resumeId = getOptionalStringValue(body?.resumeId)
    const resumeData = body?.resumeData
    const selectedTemplate = getStringValue(body?.selectedTemplate, "classic")
    const title = getStringValue(body?.title, "Untitled Resume")
    const status = getStringValue(body?.status, "draft")

    if (!isRecord(resumeData)) {
      return Response.json(
        {
          status: "error",
          message: "Valid resume data is required.",
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
          message: "You must be signed in to save resumes.",
        },
        { status: 401 },
      )
    }

    if (resumeId) {
      const { data, error } = await supabase
        .from("resumes")
        .update({
          title,
          resume_data: resumeData,
          selected_template: selectedTemplate,
          status,
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

      await supabase.from("resume_versions").insert({
        resume_id: data.id,
        user_id: user.id,
        version_label: "Manual Save",
        selected_template: selectedTemplate,
        resume_data: resumeData,
      })

      return Response.json({
        status: "success",
        message: "Resume updated permanently to Supabase.",
        resume: data,
      })
    }

    const { data, error } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        title,
        status,
        selected_template: selectedTemplate,
        resume_data: resumeData,
      })
      .select()
      .maybeSingle()

    if (error || !data) {
      return Response.json(
        {
          status: "error",
          message: error?.message || "Resume could not be created.",
        },
        { status: 500 },
      )
    }

    await supabase.from("resume_versions").insert({
      resume_id: data.id,
      user_id: user.id,
      version_label: "Manual Save",
      selected_template: selectedTemplate,
      resume_data: resumeData,
    })

    return Response.json({
      status: "success",
      message: "Resume saved permanently to Supabase.",
      resume: data,
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Save request failed.",
      },
      { status: 500 },
    )
  }
}