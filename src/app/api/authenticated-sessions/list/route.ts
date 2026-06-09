// =====================================================
// BLOCK: Supabase Server Imports
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: List Authenticated Sessions Route
// =====================================================

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return Response.json(
        {
          status: "unauthorized",
          message: "You must be signed in to view devices.",
          sessions: [],
        },
        { status: 401 },
      )
    }

    const { data, error } = await supabase
      .from("authenticated_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("last_seen_at", { ascending: false })

    if (error) {
      return Response.json(
        {
          status: "error",
          message: error.message,
          sessions: [],
        },
        { status: 500 },
      )
    }

    return Response.json({
      status: "success",
      message: "Authenticated sessions loaded.",
      sessions: data || [],
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "List authenticated sessions request failed.",
        sessions: [],
      },
      { status: 500 },
    )
  }
}
