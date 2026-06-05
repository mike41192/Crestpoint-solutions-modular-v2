// =====================================================
// BLOCK: Supabase Server Imports
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { MembershipData } from "@/modules/membership-management/types"

// =====================================================
// BLOCK: Membership Helpers
// =====================================================

function createFallbackMembership(): MembershipData {
  return {
    planName: "Free",
    status: "Active",
    atsLimit: 10,
    rewriteLimit: 5,
    resumeLimit: 3,
  }
}

async function loadServerMembership(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
): Promise<MembershipData> {
  const { data } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle()

  if (!data) {
    return createFallbackMembership()
  }

  return {
    planName: data.plan_name || "Free",
    status: data.status || "Active",
    atsLimit: Number(data.ats_limit ?? 10),
    rewriteLimit: Number(data.rewrite_limit ?? 5),
    resumeLimit: Number(data.resume_limit ?? 3),
  }
}

// =====================================================
// BLOCK: Resume Count Helpers
// =====================================================

function isUnlimitedLimit(limit: number): boolean {
  return limit < 0
}

async function loadCurrentResumeCount(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
): Promise<number> {
  const { count, error } = await supabase
    .from("resumes")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("user_id", userId)

  if (error) {
    throw new Error(error.message)
  }

  return count ?? 0
}

function canCreateAnotherResume(
  membership: MembershipData,
  currentResumeCount: number,
): {
  allowed: boolean
  message?: string
} {
  if (isUnlimitedLimit(membership.resumeLimit)) {
    return {
      allowed: true,
    }
  }

  if (currentResumeCount >= membership.resumeLimit) {
    return {
      allowed: false,
      message: `Resume limit reached. Your ${membership.planName} plan allows ${membership.resumeLimit} saved resumes. You currently have ${currentResumeCount}. Upgrade your membership to create or duplicate more resumes.`,
    }
  }

  return {
    allowed: true,
  }
}

// =====================================================
// BLOCK: Resume Duplicate Route
// =====================================================

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const resumeId = body?.resumeId

    if (!resumeId || typeof resumeId !== "string") {
      return Response.json(
        {
          status: "error",
          message: "Resume ID is required.",
        },
        { status: 400 },
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
          message: "You must be signed in to duplicate resumes.",
        },
        { status: 401 },
      )
    }

    const membership = await loadServerMembership(supabase, user.id)
    const currentResumeCount = await loadCurrentResumeCount(supabase, user.id)

    const access = canCreateAnotherResume(membership, currentResumeCount)

    if (!access.allowed) {
      return Response.json(
        {
          status: "limit_reached",
          message:
            access.message ||
            "Resume limit reached. Upgrade your membership to create more resumes.",
          currentResumeCount,
          resumeLimit: membership.resumeLimit,
        },
        { status: 403 },
      )
    }

    const { data: sourceResume, error: sourceError } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", resumeId)
      .eq("user_id", user.id)
      .maybeSingle()

    if (sourceError) {
      return Response.json(
        {
          status: "error",
          message: sourceError.message,
        },
        { status: 500 },
      )
    }

    if (!sourceResume) {
      return Response.json(
        {
          status: "error",
          message: "Source resume not found or access denied.",
        },
        { status: 404 },
      )
    }

    const { data: duplicatedResume, error: duplicateError } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        title: `${sourceResume.title || "Untitled Resume"} Copy`,
        status: "draft",
        selected_template: sourceResume.selected_template,
        resume_data: sourceResume.resume_data,
      })
      .select()
      .maybeSingle()

    if (duplicateError) {
      return Response.json(
        {
          status: "error",
          message: duplicateError.message,
        },
        { status: 500 },
      )
    }

    if (!duplicatedResume) {
      return Response.json(
        {
          status: "error",
          message: "Resume could not be duplicated.",
        },
        { status: 500 },
      )
    }

    await supabase.from("resume_versions").insert({
      resume_id: duplicatedResume.id,
      user_id: user.id,
      version_label: "Duplicated Resume",
      selected_template: duplicatedResume.selected_template,
      resume_data: duplicatedResume.resume_data,
    })

    return Response.json({
      status: "success",
      message: "Resume duplicated.",
      resume: duplicatedResume,
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Duplicate resume request failed.",
      },
      { status: 500 },
    )
  }
}
