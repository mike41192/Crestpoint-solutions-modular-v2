// =====================================================
// BLOCK: Supabase Server Imports
// Crestpoint Solutions V2
// Version: 1.8.4
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: Load Job Description Route
// =====================================================

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")?.trim() || ""

    if (!id) {
      return Response.json(
        {
          status: "error",
          message: "Job description ID is required.",
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
          message: "You must be signed in to load job descriptions.",
        },
        { status: 401 },
      )
    }

    const { data, error } = await supabase
      .from("job_descriptions")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
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
          message: "Job description not found or access denied.",
        },
        { status: 404 },
      )
    }

    return Response.json({
      status: "success",
      jobDescription: data,
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Load job description request failed.",
      },
      { status: 500 },
    )
  }
}