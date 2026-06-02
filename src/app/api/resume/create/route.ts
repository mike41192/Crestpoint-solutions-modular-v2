// =====================================================
// BLOCK: Supabase Server Imports
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: Resume Builder Imports
// =====================================================

import { starterResumeData } from "@/modules/resume-builder"

// =====================================================
// BLOCK: Constants
// =====================================================

const MAX_RESUME_TITLE_LENGTH = 120

const ALLOWED_RESUME_TEMPLATES = new Set([
  "classic",
  "modern",
  "executive",
  "ats",
])

// =====================================================
// BLOCK: Validation Helpers
// =====================================================

function getResumeTitle(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    return "Untitled Resume"
  }

  return value.trim().slice(0, MAX_RESUME_TITLE_LENGTH)
}

function getSelectedTemplate(value: unknown): string {
  if (typeof value !== "string") {
    return "classic"
  }

  return ALLOWED_RESUME_TEMPLATES.has(value) ? value : "classic"
}

// =====================================================
// BLOCK: Resume Create Route
// =====================================================

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))

    const title = getResumeTitle(body?.title)
    const selectedTemplate = getSelectedTemplate(body?.selectedTemplate)

    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return Response.json(
        {
          status: "unauthorized",
          message: "You must be signed in to create resumes.",
        },
        { status: 401 },
      )
    }

    const { data, error } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        title,
        status: "draft",
        selected_template: selectedTemplate,
        resume_data: starterResumeData,
      })
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
          message: "Resume could not be created.",
        },
        { status: 500 },
      )
    }

    await supabase.from("resume_versions").insert({
      resume_id: data.id,
      user_id: user.id,
      version_label: "Created Resume",
      selected_template: selectedTemplate,
      resume_data: starterResumeData,
    })

    return Response.json({
      status: "success",
      message: "Resume created.",
      resume: data,
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Create resume request failed.",
      },
      { status: 500 },
    )
  }
}
