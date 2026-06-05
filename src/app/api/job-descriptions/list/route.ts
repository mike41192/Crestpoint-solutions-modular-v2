// =====================================================
// BLOCK: Supabase Server Imports
// Crestpoint Solutions V2
// Version: 1.8.4
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: List Job Descriptions Route
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
          message: "You must be signed in to list job descriptions.",
        },
        { status: 401 },
      )
    }

    const { data, error } = await supabase
      .from("job_descriptions")
      .select("*")
      .eq("user_id", user.id)
      .order("status", { ascending: true })
      .order("updated_at", { ascending: false })

    if (error) {
      return Response.json(
        {
          status: "error",
          message: error.message,
          jobDescriptions: [],
        },
        { status: 500 },
      )
    }

    return Response.json({
      status: "success",
      jobDescriptions: data || [],
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "List job descriptions request failed.",
        jobDescriptions: [],
      },
      { status: 500 },
    )
  }
}