import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const resumeId = body?.resumeId

    if (!resumeId) {
      return Response.json(
        {
          status: "error",
          message: "Resume ID is required.",
          resume: null,
        },
        { status: 400 }
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
          message: "You must be signed in to load this resume.",
          resume: null,
        },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", resumeId)
      .eq("user_id", user.id)
      .single()

    if (error || !data) {
      return Response.json(
        {
          status: "error",
          message: error?.message || "Resume not found.",
          resume: null,
        },
        { status: 404 }
      )
    }

    return Response.json({
      status: "success",
      message: "Resume loaded.",
      resume: data,
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Load resume request failed.",
        resume: null,
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return Response.json({
    status: "ok",
    route: "resume_load_one",
  })
}