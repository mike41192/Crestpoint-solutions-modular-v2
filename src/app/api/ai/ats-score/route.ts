import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return Response.json(
      {
        status: "unauthorized",
        message: "Authentication required.",
      },
      { status: 401 },
    )
  }

  return Response.json({
    status: "ok",
    message: "AI route scaffold is protected.",
    timestamp: new Date().toISOString(),
  })
}
