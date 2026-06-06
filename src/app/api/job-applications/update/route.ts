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
// BLOCK: Update Job Application Route
// =====================================================

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const id = cleanText(body?.id)
    const title = cleanText(body?.title)

    if (!id) {
      return Response.json(
        {
          status: "error",
          message: "Job application ID is required.",
        },
        { status: 400 },
      )
    }

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
          message: "You must be signed in to update job applications.",
        },
        { status: 401 },
      )
    }

    const { data, error } = await supabase
      .from("job_applications")
      .update({
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
      message: "Job application updated.",
      application: data,
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Update job application request failed.",
      },
      { status: 500 },
    )
  }
}
