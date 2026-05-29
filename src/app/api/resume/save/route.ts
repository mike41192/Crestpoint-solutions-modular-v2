import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const resumeId = body?.resumeId || null
    const resumeData = body?.resumeData
    const selectedTemplate = body?.selectedTemplate || "classic"
    const title = body?.title || "Untitled Resume"
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

    let savedResume = null

    if (resumeId) {
      const { data, error } = await supabase
        .from("resumes")
        .update({
          resume_data: resumeData,
          selected_template: selectedTemplate,
          status,
        })
        .eq("id", resumeId)
        .eq("user_id", user.id)
        .select()
        .maybeSingle()

      if (error) {
        return Response.json(
          {
            status: "error",
            message: error.message,
          },
          { status: 500 }
        )
      }

      savedResume = data
    }

    if (!savedResume) {
      const { data, error } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          title,
          status,
          selected_template: selectedTemplate,
          resume_data: resumeData,
        })
        .select()
        .maybeSingle()

      if (error || !data) {
        return Response.json(
          {
            status: "error",
            message: error?.message || "Resume could not be created.",
          },
          { status: 500 }
        )
      }

      savedResume = data
    }

    await supabase.from("resume_versions").insert({
      resume_id: savedResume.id,
      user_id: user.id,
      version_label: "Manual Save",
      selected_template: selectedTemplate,
      resume_data: resumeData,
    })

    return Response.json({
      status: "success",
      message: "Resume saved permanently to Supabase.",
      resume: savedResume,
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Save request failed.",
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return Response.json({
    status: "ok",
    route: "resume_save",
  })
}
