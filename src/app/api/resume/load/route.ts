import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return Response.json(
      {
        status: "unauthorized",
        message: "You must be signed in to load resumes.",
        resumes: [],
      },
      { status: 401 }
    )
  }

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })

  if (error) {
    return Response.json(
      {
        status: "error",
        message: error.message,
        resumes: [],
      },
      { status: 500 }
    )
  }

  return Response.json({
    status: "success",
    message: "Resumes loaded from Supabase.",
    resumes: data || [],
  })
}
