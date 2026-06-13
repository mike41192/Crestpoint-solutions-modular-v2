import { requireAdminUser } from "@/lib/security/admin-auth"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { normalizeMembershipTier } from "@/lib/config/limits.config"

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
}

type Warning = {
  source: string
  message: string
}

type MembershipRow = {
  user_id?: string | null
  plan_name?: string | null
  status?: string | null
  assigned_at?: string | null
  stripe_subscription_id?: string | null
  cancel_at_period_end?: boolean | null
  current_period_end?: string | null
}

type DatedRow = {
  id?: string | null
  created_at?: string | null
  updated_at?: string | null
  status?: string | null
  severity?: string | null
  module_key?: string | null
  feature_key?: string | null
  user_id?: string | null
  relationship_status?: string | null
  plan_name?: string | null
  quality_score?: number | null
  strength_signal?: string | null
  ats_scans_used?: number | null
  ai_rewrites_used?: number | null
  resumes_created?: number | null
}

type SafeQueryOptions = {
  source: string
  table: string
  select?: string
  orderBy?: string
  limit?: number
}

function safeDate(value: string | null | undefined) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function lastDays(days: number) {
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today)
    date.setUTCDate(today.getUTCDate() - (days - 1 - index))

    return dateKey(date)
  })
}

function countRecent(rows: DatedRow[], days: number, field: "created_at" | "updated_at") {
  const cutoff = new Date()
  cutoff.setUTCDate(cutoff.getUTCDate() - days)

  return rows.filter((row) => {
    const date = safeDate(row[field])

    return date ? date >= cutoff : false
  }).length
}

function bucketByDate(rows: DatedRow[], labels: string[], field: "created_at" | "updated_at") {
  const counts = new Map(labels.map((label) => [label, 0]))

  rows.forEach((row) => {
    const date = safeDate(row[field])

    if (!date) {
      return
    }

    const key = dateKey(date)

    if (counts.has(key)) {
      counts.set(key, (counts.get(key) || 0) + 1)
    }
  })

  return labels.map((label) => ({
    label,
    value: counts.get(label) || 0,
  }))
}

function groupCount(rows: DatedRow[], key: keyof DatedRow, fallback = "unknown") {
  const counts = new Map<string, number>()

  rows.forEach((row) => {
    const value = String(row[key] || fallback)
    counts.set(value, (counts.get(value) || 0) + 1)
  })

  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
}

function sum(rows: DatedRow[], key: keyof DatedRow) {
  return rows.reduce((total, row) => {
    const value = Number(row[key] || 0)

    return total + (Number.isFinite(value) ? value : 0)
  }, 0)
}

function percentage(value: number, total: number) {
  if (total <= 0) {
    return 0
  }

  return Math.round((value / total) * 100)
}

async function safeQuery<T extends DatedRow | MembershipRow>({
  source,
  table,
  select = "*",
  orderBy,
  limit = 1000,
}: SafeQueryOptions): Promise<{ rows: T[]; warning: Warning | null }> {
  try {
    const supabase = createSupabaseAdminClient()
    let query = supabase.from(table).select(select).limit(limit)

    if (orderBy) {
      query = query.order(orderBy, { ascending: false })
    }

    const { data, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    return { rows: (data || []) as unknown as T[], warning: null }
  } catch (error) {
    return {
      rows: [],
      warning: {
        source,
        message:
          error instanceof Error ? error.message : `${source} could not be loaded.`,
      },
    }
  }
}

async function loadMemberships() {
  const result = await safeQuery<MembershipRow>({
    source: "memberships",
    table: "memberships",
    select:
      "user_id, plan_name, status, assigned_at, stripe_subscription_id, cancel_at_period_end, current_period_end",
    orderBy: "assigned_at",
  })

  if (!result.warning) {
    return result
  }

  const fallback = await safeQuery<MembershipRow>({
    source: "memberships",
    table: "memberships",
    select: "user_id, plan_name, status, assigned_at",
    orderBy: "assigned_at",
  })

  return {
    rows: fallback.rows,
    warning: fallback.warning || {
      source: "memberships billing columns",
      message:
        "Billing-specific membership columns were not available, so revenue analytics are subscription-count based.",
    },
  }
}

export async function GET() {
  const admin = await requireAdminUser()

  if (!admin.ok) {
    return admin.response
  }

  const [
    profilesResult,
    membershipsResult,
    organizationsResult,
    organizationMembersResult,
    usageResult,
    resumesResult,
    atsReportsResult,
    jobsResult,
    contactsResult,
    jobDescriptionsResult,
    learningEventsResult,
    promptSuggestionsResult,
  ] = await Promise.all([
    safeQuery<DatedRow>({
      source: "profiles",
      table: "profiles",
      select: "id, role, created_at, updated_at",
      orderBy: "created_at",
    }),
    loadMemberships(),
    safeQuery<DatedRow>({
      source: "organizations",
      table: "organizations",
      select: "id, status, tier, created_at",
      orderBy: "created_at",
    }),
    safeQuery<DatedRow>({
      source: "organization_members",
      table: "organization_members",
      select: "user_id, role, status, invited_at, joined_at, updated_at",
      orderBy: "updated_at",
    }),
    safeQuery<DatedRow>({
      source: "user_usage",
      table: "user_usage",
      select: "user_id, ats_scans_used, ai_rewrites_used, resumes_created",
    }),
    safeQuery<DatedRow>({
      source: "resumes",
      table: "resumes",
      select: "id, user_id, status, created_at, updated_at",
      orderBy: "updated_at",
    }),
    safeQuery<DatedRow>({
      source: "resume_ats_reports",
      table: "resume_ats_reports",
      select: "id, user_id, score, created_at",
      orderBy: "created_at",
    }),
    safeQuery<DatedRow>({
      source: "job_applications",
      table: "job_applications",
      select: "id, user_id, status, created_at, updated_at",
      orderBy: "updated_at",
    }),
    safeQuery<DatedRow>({
      source: "career_contacts",
      table: "career_contacts",
      select: "id, user_id, relationship_status, created_at, updated_at",
      orderBy: "updated_at",
    }),
    safeQuery<DatedRow>({
      source: "job_descriptions",
      table: "job_descriptions",
      select: "id, user_id, status, created_at, updated_at",
      orderBy: "updated_at",
    }),
    safeQuery<DatedRow>({
      source: "ai_learning_events",
      table: "ai_learning_events",
      select: "id, module_key, feature_key, severity, score, user_rating, created_at",
      orderBy: "created_at",
    }),
    safeQuery<DatedRow>({
      source: "ai_prompt_improvement_suggestions",
      table: "ai_prompt_improvement_suggestions",
      select:
        "id, module_key, feature_key, status, quality_score, strength_signal, created_at",
      orderBy: "created_at",
    }),
  ])

  const warnings = [
    profilesResult.warning,
    membershipsResult.warning,
    organizationsResult.warning,
    organizationMembersResult.warning,
    usageResult.warning,
    resumesResult.warning,
    atsReportsResult.warning,
    jobsResult.warning,
    contactsResult.warning,
    jobDescriptionsResult.warning,
    learningEventsResult.warning,
    promptSuggestionsResult.warning,
  ].filter((warning): warning is Warning => Boolean(warning))

  const profiles = profilesResult.rows
  const memberships = membershipsResult.rows
  const organizations = organizationsResult.rows
  const organizationMembers = organizationMembersResult.rows
  const usage = usageResult.rows
  const resumes = resumesResult.rows
  const atsReports = atsReportsResult.rows
  const jobs = jobsResult.rows
  const contacts = contactsResult.rows
  const jobDescriptions = jobDescriptionsResult.rows
  const learningEvents = learningEventsResult.rows
  const promptSuggestions = promptSuggestionsResult.rows

  const activeMemberships = memberships.filter((membership) =>
    ["active", "trialing"].includes(String(membership.status || "").toLowerCase()),
  )
  const paidMemberships = activeMemberships.filter(
    (membership) => normalizeMembershipTier(membership.plan_name) !== "free",
  )
  const activeSubscriptions = activeMemberships.filter(
    (membership) => Boolean(membership.stripe_subscription_id),
  ).length
  const cancelingSubscriptions = memberships.filter(
    (membership) => membership.cancel_at_period_end,
  ).length
  const activeOrgMembers = organizationMembers.filter(
    (member) => member.status !== "removed",
  ).length
  const activeJobs = jobs.filter((job) =>
    ["saved", "applied", "follow_up", "interviewing", "offer"].includes(
      String(job.status || ""),
    ),
  ).length
  const interviewingJobs = jobs.filter((job) =>
    ["interviewing", "offer"].includes(String(job.status || "")),
  ).length
  const activeContacts = contacts.filter((contact) =>
    ["contacted", "active", "follow_up"].includes(
      String(contact.relationship_status || ""),
    ),
  ).length
  const negativeLearning = learningEvents.filter((event) =>
    ["needs_review", "critical"].includes(String(event.severity || "")),
  ).length
  const promptScores = promptSuggestions
    .map((prompt) => Number(prompt.quality_score))
    .filter((score) => Number.isFinite(score))
  const labels = lastDays(14)
  const userGrowth = bucketByDate(profiles, labels, "created_at")
  const resumeGrowth = bucketByDate(resumes, labels, "created_at")
  const jobGrowth = bucketByDate(jobs, labels, "created_at")
  const aiGrowth = bucketByDate(learningEvents, labels, "created_at")
  const userSet = new Set([
    ...profiles.map((profile) => profile.user_id || profile.id).filter(Boolean),
    ...memberships.map((membership) => membership.user_id).filter(Boolean),
    ...resumes.map((resume) => resume.user_id).filter(Boolean),
    ...jobs.map((job) => job.user_id).filter(Boolean),
    ...contacts.map((contact) => contact.user_id).filter(Boolean),
  ])

  const payload = {
    status: "success",
    generatedAt: new Date().toISOString(),
    warnings,
    kpis: {
      users: userSet.size || profiles.length,
      newUsers7d: countRecent(profiles, 7, "created_at"),
      organizations: organizations.length,
      activeCompanySeats: activeOrgMembers,
      paidMemberships: paidMemberships.length,
      activeSubscriptions,
      cancelingSubscriptions,
      resumes: resumes.length,
      trackedJobs: jobs.length,
      activeJobs,
      interviewRate: percentage(interviewingJobs, Math.max(activeJobs, 1)),
      contacts: contacts.length,
      relationshipCoverage: percentage(activeContacts, Math.max(contacts.length, 1)),
      aiEvents: learningEvents.length,
      promptAverageScore:
        promptScores.length === 0
          ? null
          : Math.round(
              promptScores.reduce((total, score) => total + score, 0) /
                promptScores.length,
            ),
      negativeLearning,
    },
    charts: {
      growth: labels.map((label, index) => ({
        label,
        users: userGrowth[index]?.value || 0,
        resumes: resumeGrowth[index]?.value || 0,
        jobs: jobGrowth[index]?.value || 0,
        ai: aiGrowth[index]?.value || 0,
      })),
      memberships: groupCount(
        memberships.map((membership) => ({
          plan_name: normalizeMembershipTier(membership.plan_name),
        })),
        "plan_name",
        "free",
      ),
      modules: [
        { label: "Resumes", value: resumes.length },
        { label: "ATS Reports", value: atsReports.length },
        { label: "Jobs", value: jobs.length },
        { label: "Contacts", value: contacts.length },
        { label: "Job Descriptions", value: jobDescriptions.length },
        { label: "AI Events", value: learningEvents.length },
      ],
      jobStatus: groupCount(jobs, "status", "saved"),
      aiSeverity: groupCount(learningEvents, "severity", "info"),
      promptStrength: groupCount(promptSuggestions, "strength_signal", "unproven"),
      usage: [
        { label: "ATS Scans", value: sum(usage, "ats_scans_used") },
        { label: "AI Rewrites", value: sum(usage, "ai_rewrites_used") },
        { label: "Resumes Created", value: sum(usage, "resumes_created") },
      ],
      funnel: [
        { label: "Users", value: userSet.size || profiles.length },
        { label: "Resumes", value: new Set(resumes.map((row) => row.user_id)).size },
        { label: "Jobs", value: new Set(jobs.map((row) => row.user_id)).size },
        { label: "Contacts", value: new Set(contacts.map((row) => row.user_id)).size },
        { label: "Paid", value: paidMemberships.length },
      ],
    },
  }

  return Response.json(payload, { headers: NO_STORE_HEADERS })
}
