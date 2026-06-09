// =====================================================
// BLOCK: Supabase Server Imports
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: Constants
// =====================================================

const CONTACT_TYPES = [
  "recruiter",
  "hiring_manager",
  "networking",
  "coworker",
  "mentor",
  "other",
]

const RELATIONSHIP_STATUSES = [
  "new",
  "contacted",
  "active",
  "follow_up",
  "closed",
]

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

function cleanContactType(value: unknown) {
  return typeof value === "string" && CONTACT_TYPES.includes(value)
    ? value
    : "recruiter"
}

function cleanRelationshipStatus(value: unknown) {
  return typeof value === "string" && RELATIONSHIP_STATUSES.includes(value)
    ? value
    : "new"
}

// =====================================================
// BLOCK: Create Career Contact Route
// =====================================================

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const name = cleanText(body?.name)

    if (!name) {
      return Response.json(
        {
          status: "error",
          message: "Contact name is required.",
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
          message: "You must be signed in to create career contacts.",
        },
        { status: 401 },
      )
    }

    const { data, error } = await supabase
      .from("career_contacts")
      .insert({
        user_id: user.id,
        name,
        company: cleanText(body?.company),
        role: cleanText(body?.role),
        email: cleanText(body?.email),
        phone: cleanText(body?.phone),
        linkedin_url: cleanText(body?.linkedinUrl),
        contact_type: cleanContactType(body?.contactType),
        relationship_status: cleanRelationshipStatus(body?.relationshipStatus),
        notes: cleanText(body?.notes),
        last_contacted_at: cleanOptionalDate(body?.lastContactedAt),
        follow_up_at: cleanOptionalDate(body?.followUpAt),
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
      message: "Career contact created.",
      contact: data,
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Create career contact request failed.",
      },
      { status: 500 },
    )
  }
}
