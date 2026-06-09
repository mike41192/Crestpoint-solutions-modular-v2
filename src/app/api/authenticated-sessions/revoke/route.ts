// =====================================================
// BLOCK: Supabase Server Imports
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: Helpers
// =====================================================

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

// =====================================================
// BLOCK: Revoke Authenticated Session Route
// =====================================================

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const id = cleanText(body?.id)

    if (!id) {
      return Response.json(
        {
          status: "error",
          message: "Authenticated session ID is required.",
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
          message: "You must be signed in to revoke devices.",
        },
        { status: 401 },
      )
    }

    const { data, error } = await supabase
      .from("authenticated_sessions")
      .update({
        revoked_at: new Date().toISOString(),
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
          message: "Device session not found or access denied.",
        },
        { status: 404 },
      )
    }

    return Response.json({
      status: "success",
      message: "Device session revoked.",
      session: data,
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Revoke authenticated session request failed.",
      },
      { status: 500 },
    )
  }
}
