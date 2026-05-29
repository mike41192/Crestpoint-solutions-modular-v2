import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const resumeId = body?.resumeId
    const title = body?.title?.trim()

    if (!resumeId) {
      return Response.json(
        {
          status: "error",
          message: "Resume ID is required.",
        },
        { status: 400 }
      )
    }

    if (!title) {
      return Response.json(
        {
          status: "error",
          message: "Resume title is required.",
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
          message: "You must be signed in to rename resumes.",
        },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from("resumes")
      .update({
        title,
      })
      .eq("id", resumeId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      return Response.json(
        {
          status: "error",
          message: error.message,
        },
        { status: 500 }
      )
    }

    return Response.json({
      status: "success",
      message: "Resume renamed.",
      resume: data,
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Rename resume request failed.",
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return Response.json({
    status: "ok",
    route: "resume_rename",
  })
}
