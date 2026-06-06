// =====================================================
// BLOCK: Supabase Server Imports
// Crestpoint Solutions V2
// Version: 1.9.0
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: List Job Applications Route
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
          message: "You must be signed in to list job applications.",
          applications: [],
        },
        { status: 401 },
      )
    }

    const { data, error } = await supabase
      .from("job_applications")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) {
      return Response.json(
        {
          status: "error",
          message: error.message,
          applications: [],
        },
        { status: 500 },
      )
    }

    return Response.json({
      status: "success",
      message: "Job applications loaded.",
      applications: data || [],
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "List job applications request failed.",
        applications: [],
      },
      { status: 500 },
    )
  }
}
