// =====================================================
// BLOCK: Supabase Server Imports
// Crestpoint Solutions V2
// Version: 1.9.0
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: Helpers
// =====================================================

function cleanText(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback
}

function cleanOptionalDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? null : date.toISOString()
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
    : "saved"
}

function cleanPriority(value: unknown) {
  const allowed = ["low", "medium", "high"]

  return typeof value === "string" && allowed.includes(value)
    ? value
    : "medium"
}

// =====================================================
// BLOCK: Create Job Application Route
// =====================================================

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const title = cleanText(body?.title)

    if (!title) {
      return Response.json(
        {
          status: "error",
          message: "Job title is required.",
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
          message: "You must be signed in to create job applications.",
        },
        { status: 401 },
      )
    }

    const { data, error } = await supabase
      .from("job_applications")
      .insert({
        user_id: user.id,
        job_description_id: body?.jobDescriptionId || null,
        title,
        company: cleanText(body?.company),
        location: cleanText(body?.location),
        source_url: cleanText(body?.sourceUrl),
        salary_range: cleanText(body?.salaryRange),
        status: cleanStatus(body?.status),
        priority: cleanPriority(body?.priority),
        next_action: cleanText(body?.nextAction),
        notes: cleanText(body?.notes),
        applied_at: cleanOptionalDate(body?.appliedAt),
        follow_up_at: cleanOptionalDate(body?.followUpAt),
        interview_at: cleanOptionalDate(body?.interviewAt),
      })
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

    return Response.json({
      status: "success",
      message: "Job application created.",
      application: data,
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Create job application request failed.",
      },
      { status: 500 },
    )
  }
}
