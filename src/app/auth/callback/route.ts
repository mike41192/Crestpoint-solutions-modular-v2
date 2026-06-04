import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/auth/reset-password"

  if (!code) {
    return NextResponse.redirect(new URL("/auth/login", requestUrl.origin))
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error("AUTH CALLBACK ERROR:", error.message)
    return NextResponse.redirect(new URL("/auth/login", requestUrl.origin))
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
