import { requireAdminUser } from "@/lib/security/admin-auth"
import { loadEditableUsageLimits } from "@/lib/config/usage-limits-service"
import type { TierUsageLimits } from "@/lib/config/limits.config"
import { membershipTiers } from "@/lib/config/tiers.config"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import type { MembershipTier } from "@/types/modules"

type LimitKey =
  | "aiCreditsPerMonth"
  | "resumeUploadsPerMonth"
  | "resumeExportsPerMonth"
  | "atsScansPerMonth"
  | "mockInterviewsPerMonth"
  | "trackedJobs"

const LIMIT_KEYS: LimitKey[] = [
  "aiCreditsPerMonth",
  "resumeUploadsPerMonth",
  "resumeExportsPerMonth",
  "atsScansPerMonth",
  "mockInterviewsPerMonth",
  "trackedJobs",
]

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
}

function isMembershipTier(value: unknown): value is MembershipTier {
  return (
    typeof value === "string" &&
    membershipTiers.includes(value as MembershipTier)
  )
}

function cleanLimitValue(value: unknown) {
  const numberValue = Number(value)

  if (!Number.isFinite(numberValue)) {
    return 0
  }

  return Math.max(-1, Math.trunc(numberValue))
}

function cleanLimitRecord(value: unknown): TierUsageLimits | null {
  if (!value || typeof value !== "object") {
    return null
  }

  const rawRecord = value as Record<string, unknown>

  if (!isMembershipTier(rawRecord.tier)) {
    return null
  }

  return {
    tier: rawRecord.tier,
    aiCreditsPerMonth: cleanLimitValue(rawRecord.aiCreditsPerMonth),
    resumeUploadsPerMonth: cleanLimitValue(rawRecord.resumeUploadsPerMonth),
    resumeExportsPerMonth: cleanLimitValue(rawRecord.resumeExportsPerMonth),
    atsScansPerMonth: cleanLimitValue(rawRecord.atsScansPerMonth),
    mockInterviewsPerMonth: cleanLimitValue(rawRecord.mockInterviewsPerMonth),
    trackedJobs: cleanLimitValue(rawRecord.trackedJobs),
  }
}

function cleanLimitRecords(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => cleanLimitRecord(item))
    .filter((item): item is TierUsageLimits => Boolean(item))
}

function toDatabaseRow(limits: TierUsageLimits, updatedBy: string | null) {
  return {
    tier: limits.tier,
    ai_credits_per_month: limits.aiCreditsPerMonth,
    resume_uploads_per_month: limits.resumeUploadsPerMonth,
    resume_exports_per_month: limits.resumeExportsPerMonth,
    ats_scans_per_month: limits.atsScansPerMonth,
    mock_interviews_per_month: limits.mockInterviewsPerMonth,
    tracked_jobs: limits.trackedJobs,
    updated_by: updatedBy,
    updated_at: new Date().toISOString(),
  }
}

export async function GET() {
  const admin = await requireAdminUser()

  if (!admin.ok) {
    return admin.response
  }

  const limits = await loadEditableUsageLimits()

  return Response.json(
    {
      status: "success",
      message: "Usage limits loaded.",
      limits,
      editableFields: LIMIT_KEYS,
    },
    { headers: NO_STORE_HEADERS },
  )
}

export async function POST(request: Request) {
  const admin = await requireAdminUser()

  if (!admin.ok) {
    return admin.response
  }

  try {
    const body = await request.json().catch(() => ({}))
    const limits = cleanLimitRecords(body?.limits)

    if (limits.length !== membershipTiers.length) {
      return Response.json(
        {
          status: "error",
          message: "A complete set of tier limits is required.",
        },
        { status: 400, headers: NO_STORE_HEADERS },
      )
    }

    const supabase = createSupabaseAdminClient()

    const { error } = await supabase
      .from("membership_tier_limits")
      .upsert(
        limits.map((item) => toDatabaseRow(item, admin.email)),
        { onConflict: "tier" },
      )

    if (error) {
      return Response.json(
        {
          status: "error",
          message: error.message,
        },
        { status: 500, headers: NO_STORE_HEADERS },
      )
    }

    const savedLimits = await loadEditableUsageLimits()

    return Response.json(
      {
        status: "success",
        message: "Usage limits saved.",
        limits: savedLimits,
      },
      { headers: NO_STORE_HEADERS },
    )
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Usage limit update failed.",
      },
      { status: 500, headers: NO_STORE_HEADERS },
    )
  }
}
