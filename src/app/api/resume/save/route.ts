import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const resumeData = body?.resumeData
    const title = body?.title || "Primary Resume"
    const status = body?.status || "draft"

    if (!resumeData) {
      return Response.json(
        {
          status: "error",
          message: "Resume data is required.",
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
          message: "You must be signed in to save resumes.",
        },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from("resumes")
      .upsert(
        {
          user_id: user.id,
          title,
          status,
          resume_data: resumeData,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,title",
        }
      )
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
      message: "Resume saved to Supabase.",
      resume: data,
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Invalid request body.",
      },
      { status: 400 }
    )
  }
}

export async function GET() {
  return Response.json({
    status: "ok",
    route: "resume_save",
  })
}