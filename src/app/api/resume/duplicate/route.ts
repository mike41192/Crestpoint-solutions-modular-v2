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
          message: "You must be signed in to duplicate resumes.",
        },
        { status: 401 }
      )
    }

    const { data: sourceResume, error: sourceError } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", resumeId)
      .eq("user_id", user.id)
      .single()

    if (sourceError || !sourceResume) {
      return Response.json(
        {
          status: "error",
          message: sourceError?.message || "Source resume not found.",
        },
        { status: 404 }
      )
    }

    const { data: duplicatedResume, error: duplicateError } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        title: `${sourceResume.title} Copy`,
        status: "draft",
        selected_template: sourceResume.selected_template,
        resume_data: sourceResume.resume_data,
      })
      .select()
      .single()

    if (duplicateError) {
      return Response.json(
        {
          status: "error",
          message: duplicateError.message,
        },
        { status: 500 }
      )
    }

    await supabase.from("resume_versions").insert({
      resume_id: duplicatedResume.id,
      user_id: user.id,
      version_label: "Duplicated Resume",
      selected_template: duplicatedResume.selected_template,
      resume_data: duplicatedResume.resume_data,
    })

    return Response.json({
      status: "success",
      message: "Resume duplicated.",
      resume: duplicatedResume,
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Duplicate resume request failed.",
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return Response.json({
    status: "ok",
    route: "resume_duplicate",
  })
}
