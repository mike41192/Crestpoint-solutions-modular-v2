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
// BLOCK: Create Job Description Route
// =====================================================

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))

    const description = cleanText(body?.description)

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
          message: "You must be signed in to save job descriptions.",
        },
        { status: 401 },
      )
    }

    const title =
      limitText(cleanText(body?.title), MAX_TITLE_LENGTH) ||
      "Untitled Job Description"

    const { data, error } = await supabase
      .from("job_descriptions")
      .insert({
        user_id: user.id,
        title,
        company: limitText(cleanText(body?.company), MAX_SHORT_FIELD_LENGTH),
        role: limitText(cleanText(body?.role), MAX_SHORT_FIELD_LENGTH),
        location: limitText(cleanText(body?.location), MAX_SHORT_FIELD_LENGTH),
        description,
        source_url: limitText(cleanText(body?.sourceUrl), MAX_SOURCE_URL_LENGTH),
        status: getStatus(body?.status),
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
      message: "Job description saved.",
      jobDescription: data,
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Create job description request failed.",
      },
      { status: 500 },
    )
  }
}