// =====================================================
// BLOCK: Next Response Imports
// =====================================================

import { NextResponse } from "next/server"

// =====================================================
// BLOCK: Supabase Server Imports
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: Admin Auth Types
// =====================================================

export type AdminAuthResult =
  | {
      ok: true
      userId: string
      email: string | null
      response?: never
    }
  | {
      ok: false
      response: NextResponse
    }

// =====================================================
// BLOCK: Admin Configuration
// =====================================================

export function getConfiguredAdminEmails(): string[] {
  const configuredEmails = process.env.ADMIN_EMAILS || ""

  return configuredEmails
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export function isConfiguredAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false
  }

  return getConfiguredAdminEmails().includes(email.toLowerCase())
}

// =====================================================
// BLOCK: Admin Validation Helper
// =====================================================

export async function requireAdminUser(): Promise<AdminAuthResult> {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          status: "error",
          message: "Authentication required.",
        },
        { status: 401 },
      ),
    }
  }

  const userEmail = user.email?.toLowerCase() || null

  if (!isConfiguredAdminEmail(userEmail)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          status: "error",
          message: "Admin access required.",
        },
        { status: 403 },
      ),
    }
  }

  return {
    ok: true,
    userId: user.id,
    email: userEmail,
  }
}
