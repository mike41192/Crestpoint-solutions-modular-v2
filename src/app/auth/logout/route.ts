// =====================================================
// BLOCK: Next / Supabase Imports
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import { NextResponse, type NextRequest } from "next/server"

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: Helpers
// =====================================================

function buildLoginRedirect(request: NextRequest, message: string) {
  const url = new URL("/auth/login", request.url)

  url.searchParams.set("message", message)

  return NextResponse.redirect(url)
}

// =====================================================
// BLOCK: Logout Route
// =====================================================

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient()

  await supabase.auth.signOut()

  return buildLoginRedirect(request, "You have been signed out.")
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient()

  await supabase.auth.signOut()

  return buildLoginRedirect(request, "You have been signed out.")
}
