// =====================================================
// BLOCK: Supabase Server Imports
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: List Career Contacts Route
// =====================================================

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return Response.json(
        {
          status: "unauthorized",
          message: "You must be signed in to list career contacts.",
          contacts: [],
        },
        { status: 401 },
      )
    }

    const { data, error } = await supabase
      .from("career_contacts")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) {
      return Response.json(
        {
          status: "error",
          message: error.message,
          contacts: [],
        },
        { status: 500 },
      )
    }

    return Response.json({
      status: "success",
      message: "Career contacts loaded.",
      contacts: data || [],
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "List career contacts request failed.",
        contacts: [],
      },
      { status: 500 },
    )
  }
}
