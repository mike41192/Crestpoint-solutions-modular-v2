// =====================================================
// BLOCK: Supabase / Security Imports
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import { isConfiguredAdminEmail } from "@/lib/security/admin-auth"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import {
  createMembershipLimitSnapshot,
  normalizeMembershipTier,
} from "@/lib/config/limits.config"
import { loadMembershipLimitSnapshotForPlan } from "@/lib/config/usage-limits-service"

// =====================================================
// BLOCK: Membership Helpers
// =====================================================

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
}

async function createMembershipResponse(
  planName: string | null | undefined,
  status = "Active",
) {
  const limits = await loadMembershipLimitSnapshotForPlan(planName)

  return {
    ...limits,
    planName: limits.planName,
    status,
  }
}

function createFallbackMembership() {
  const limits = createMembershipLimitSnapshot("free")

  return {
    ...limits,
    status: "Active",
  }
}

// =====================================================
// BLOCK: User Membership Route
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
          message: "You must be signed in to load membership.",
          membership: createFallbackMembership(),
        },
        { status: 401, headers: NO_STORE_HEADERS },
      )
    }

    if (isConfiguredAdminEmail(user.email)) {
      return Response.json(
        {
          status: "success",
          message: "Admin membership resolved from ADMIN_EMAILS.",
          source: "admin_email",
          membership: await createMembershipResponse("admin"),
        },
        { headers: NO_STORE_HEADERS },
      )
    }

    const { data, error } = await supabase
      .from("memberships")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()

    if (error) {
      return Response.json(
        {
          status: "error",
          message: error.message,
          membership: createFallbackMembership(),
        },
        { status: 500, headers: NO_STORE_HEADERS },
      )
    }

    if (!data) {
      return Response.json(
        {
          status: "success",
          message: "No membership row found.",
          source: "fallback",
          membership: await createMembershipResponse("free"),
        },
        { headers: NO_STORE_HEADERS },
      )
    }

    const tier = normalizeMembershipTier(data.plan_name)

    return Response.json(
      {
        status: "success",
        message: "Membership loaded.",
        source: "database_editable_limits",
        membership: await createMembershipResponse(
          tier,
          data.status || "Active",
        ),
      },
      { headers: NO_STORE_HEADERS },
    )
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Membership request failed.",
        membership: createFallbackMembership(),
      },
      { status: 500, headers: NO_STORE_HEADERS },
    )
  }
}
