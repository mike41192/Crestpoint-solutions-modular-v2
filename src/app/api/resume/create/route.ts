import { createSupabaseServerClient } from "@/lib/supabase/server"
import { starterResumeData } from "@/modules/resume-builder"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))

    const title = body?.title || "Untitled Resume"
    const selectedTemplate = body?.selectedTemplate || "classic"

    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return Response.json(
        {
          status: "unauthorized",
          message: "You must be signed in to create resumes.",
        },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        title,
        status: "draft",
        selected_template: selectedTemplate,
        resume_data: starterResumeData,
      })
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

    await supabase.from("resume_versions").insert({
      resume_id: data.id,
      user_id: user.id,
      version_label: "Created Resume",
      selected_template: selectedTemplate,
      resume_data: starterResumeData,
    })

    return Response.json({
      status: "success",
      message: "Resume created.",
      resume: data,
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Create resume request failed.",
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return Response.json({
    status: "ok",
    route: "resume_create",
  })
}
