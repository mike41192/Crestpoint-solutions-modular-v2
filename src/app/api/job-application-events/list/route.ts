// =====================================================
// BLOCK: Supabase Server Imports
// Crestpoint Solutions V2
// Version: 1.9.8
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: List Job Application Events Route
// =====================================================

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const jobApplicationId =
      url.searchParams.get("jobApplicationId")?.trim() || ""

    if (!jobApplicationId) {
      return Response.json(
        {
          status: "error",
          message: "Job application ID is required.",
          events: [],
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
          message: "You must be signed in to view job application events.",
          events: [],
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
          events: [],
        },
        { status: 500 },
      )
    }

    if (!ownedApplication) {
      return Response.json(
        {
          status: "not_found",
          message: "Job application not found or access denied.",
          events: [],
        },
        { status: 404 },
      )
    }

    const { data, error } = await supabase
      .from("job_application_events")
      .select("*")
      .eq("job_application_id", jobApplicationId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return Response.json(
        {
          status: "error",
          message: error.message,
          events: [],
        },
        { status: 500 },
      )
    }

    return Response.json({
      status: "success",
      message: "Job application events loaded.",
      events: data || [],
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "List job application events request failed.",
        events: [],
      },
      { status: 500 },
    )
  }
}