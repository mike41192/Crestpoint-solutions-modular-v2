import { NextResponse } from "next/server"

import { isConfiguredAdminEmail } from "@/lib/security/admin-auth"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export type AccessManagerScope =
  | {
      kind: "owner"
      organizationIds: null
    }
  | {
      kind: "organization"
      organizationIds: string[]
    }

export type AccessManagerAuthResult =
  | {
      ok: true
      userId: string
      email: string | null
      scope: AccessManagerScope
      response?: never
    }
  | {
      ok: false
      response: NextResponse
    }

export async function requireAccessManager(): Promise<AccessManagerAuthResult> {
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

  if (isConfiguredAdminEmail(userEmail)) {
    return {
      ok: true,
      userId: user.id,
      email: userEmail,
      scope: {
        kind: "owner",
        organizationIds: null,
      },
    }
  }

  const adminSupabase = createSupabaseAdminClient()

  const { data, error: membershipError } = await adminSupabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .in("role", ["owner", "admin"])

  if (membershipError) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          status: "error",
          message: membershipError.message,
        },
        { status: 500 },
      ),
    }
  }

  const organizationIds = (data || [])
    .map((row) => row.organization_id)
    .filter((value): value is string => Boolean(value))

  if (organizationIds.length === 0) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          status: "error",
          message: "Access manager permission required.",
        },
        { status: 403 },
      ),
    }
  }

  return {
    ok: true,
    userId: user.id,
    email: userEmail,
    scope: {
      kind: "organization",
      organizationIds,
    },
  }
}
