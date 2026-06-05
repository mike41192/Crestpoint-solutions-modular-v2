// =====================================================
// BLOCK: Supabase Server Imports
// Crestpoint Solutions V2
// Version: 1.8.4
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: Constants
// =====================================================

const MAX_TITLE_LENGTH = 160
const MAX_SHORT_FIELD_LENGTH = 180
const MAX_SOURCE_URL_LENGTH = 500

// =====================================================
// BLOCK: Validation Helpers
// =====================================================

function cleanText(value: unknown, fallback = ""): string {
  if (typeof value !== "string") {
    return fallback
  }

  return value.trim()
}

function limitText(value: string, maxLength: number): string {
  return value.slice(0, maxLength)
}

function getStatus(value: unknown): "active" | "archived" {
  return value === "archived" ? "archived" : "active"
}

// =====================================================
// BLOCK: Update Job Description Route
// =====================================================

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))

    const id = cleanText(body?.id)
    const description = cleanText(body?.description)

    if (!id) {
      return Response.json(
        {
          status: "error",
          message: "Job description ID is required.",
        },
        { status: 400 },
      )
    }

    if (!description) {
      return Response.json(
        {
          status: "error",
          message: "Job description text is required.",
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
          message: "You must be signed in to update job descriptions.",
        },
        { status: 401 },
      )
    }

    const { data: existingRecord, error: existingError } = await supabase
      .from("job_descriptions")
      .select("id,user_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle()

    if (existingError) {
      return Response.json(
        {
          status: "error",
          message: existingError.message,
        },
        { status: 500 },
      )
    }

    if (!existingRecord) {
      return Response.json(
        {
          status: "not_found",
          message: "Job description not found or access denied.",
        },
        { status: 404 },
      )
    }

    const title =
      limitText(cleanText(body?.title), MAX_TITLE_LENGTH) ||
      "Untitled Job Description"

    const { data, error } = await supabase
      .from("job_descriptions")
      .update({
        title,
        company: limitText(cleanText(body?.company), MAX_SHORT_FIELD_LENGTH),
        role: limitText(cleanText(body?.role), MAX_SHORT_FIELD_LENGTH),
        location: limitText(cleanText(body?.location), MAX_SHORT_FIELD_LENGTH),
        description,
        source_url: limitText(cleanText(body?.sourceUrl), MAX_SOURCE_URL_LENGTH),
        status: getStatus(body?.status),
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

    return Response.json({
      status: "success",
      message: "Job description updated.",
      jobDescription: data,
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Update job description request failed.",
      },
      { status: 500 },
    )
  }
}
