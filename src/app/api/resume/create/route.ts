// =====================================================
// BLOCK: Supabase Server Imports
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: Resume Builder Imports
// =====================================================

import { starterResumeData } from "@/modules/resume-builder"

// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { MembershipData } from "@/modules/membership-management/types"

// =====================================================
// BLOCK: Constants
// =====================================================

const MAX_RESUME_TITLE_LENGTH = 120

const ALLOWED_RESUME_TEMPLATES = new Set([
  "classic",
  "modern",
  "executive",
  "ats",
])

// =====================================================
// BLOCK: Validation Helpers
// =====================================================

function getResumeTitle(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    return "Untitled Resume"
  }

  return value.trim().slice(0, MAX_RESUME_TITLE_LENGTH)
}

function getSelectedTemplate(value: unknown): string {
  if (typeof value !== "string") {
    return "classic"
  }

  return ALLOWED_RESUME_TEMPLATES.has(value) ? value : "classic"
}

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
// BLOCK: Resume Create Route
// =====================================================

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))

    const title = getResumeTitle(body?.title)
    const selectedTemplate = getSelectedTemplate(body?.selectedTemplate)

    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return Response.json(
        {
          status: "unauthorized",
          message: "You must be signed in to create resumes.",
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

    const { data, error } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        title,
        status: "draft",
        selected_template: selectedTemplate,
        resume_data: starterResumeData,
      })
      .select()
      .maybeSingle()

    if (error) {
      return Response.json(
        {
          status: "error",
          message: error.message,
        },
        { status: 500 },
      )
    }

    if (!data) {
      return Response.json(
        {
          status: "error",
          message: "Resume could not be created.",
        },
        { status: 500 },
      )
    }

    await supabase.from("resume_versions").insert({
      resume_id: data.id,
      user_id: user.id,
      version_label: "Created Resume",
      selected_template: selectedTemplate,
      resume_data: starterResumeData,
    })

    return Response.json({
      status: "success",
      message: "Resume created.",
      resume: data,
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Create resume request failed.",
      },
      { status: 500 },
    )
  }
}