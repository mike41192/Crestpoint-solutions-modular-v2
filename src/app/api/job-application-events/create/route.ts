// =====================================================
// BLOCK: Supabase Server Imports
// Crestpoint Solutions V2
// Version: 1.9.7
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: Helpers
// =====================================================

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function cleanNullableText(value: unknown) {
  const cleaned = cleanText(value)

  return cleaned || null
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

function cleanEventType(value: unknown) {
  const allowed = [
    "created",
    "updated",
    "deleted",
    "status_changed",
    "note_added",
    "follow_up_set",
  ]

  return typeof value === "string" && allowed.includes(value)
    ? value
    : null
}

// =====================================================
// BLOCK: Create Job Application Event Route
// =====================================================

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))

    const jobApplicationId = cleanText(body?.jobApplicationId)
    const eventType = cleanEventType(body?.eventType)
    const fromStatus = cleanStatus(body?.fromStatus)
    const toStatus = cleanStatus(body?.toStatus)
    const note = cleanNullableText(body?.note)

    if (!jobApplicationId || !eventType) {
      return Response.json(
        {
          status: "error",
          message: "Job application ID and event type are required.",
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
          message: "You must be signed in to create job application events.",
        },
        { status: 401 },
      )
    }

    const { data: ownedApplication, error: applicationError } = await supabase
      .from("job_applications")
      .select("id")
      .eq("id", jobApplicationId)
      .eq("user_id", user.id)
      .maybeSingle()

    if (applicationError) {
      return Response.json(
        {
          status: "error",
          message: applicationError.message,
        },
        { status: 500 },
      )
    }

    if (!ownedApplication) {
      return Response.json(
        {
          status: "not_found",
          message: "Job application not found or access denied.",
        },
        { status: 404 },
      )
    }

    const { data, error } = await supabase
      .from("job_application_events")
      .insert({
        user_id: user.id,
        job_application_id: jobApplicationId,
        event_type: eventType,
        from_status: fromStatus,
        to_status: toStatus,
        note,
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
      message: "Job application event created.",
      event: data,
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Create job application event request failed.",
      },
      { status: 500 },
    )
  }
}