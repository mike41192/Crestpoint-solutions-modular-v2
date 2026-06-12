"use client"

import {
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from "react"
import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Target,
} from "lucide-react"

import type { AnalyticsDashboardInsightArea } from "@/modules/analytics-dashboard"
import { analyzeJobTracker } from "@/modules/job-tracker-analytics"
import type { JobApplicationRecord } from "@/modules/job-tracker"
import type { CareerContactRecord } from "@/modules/career-crm/types"
import type { ResumeBuilderFormData } from "@/modules/resume-builder/types"

type SavedResumeRecord = {
  id?: string
  title?: string
  resume_data?: ResumeBuilderFormData
  updated_at?: string
}

type JobDescriptionRecord = {
  id?: string
  title?: string
  company?: string
  role?: string
  status?: string
  description?: string
  updated_at?: string
  updatedAt?: string
}

type AnalyticsInsightWorkspaceProps = {
  area: AnalyticsDashboardInsightArea
}

type Metric = {
  label: string
  value: string
  detail: string
}

type ProgressItem = {
  label: string
  value: number
  detail: string
}

type DistributionItem = {
  label: string
  value: number
}

type InsightModel = {
  score: number
  scoreLabel: string
  headline: string
  summary: string
  metrics: Metric[]
  progress: ProgressItem[]
  distributionTitle: string
  distribution: DistributionItem[]
  focusItems: string[]
  emptyTitle: string
  emptyDescription: string
}

export function AnalyticsInsightWorkspace({
  area,
}: AnalyticsInsightWorkspaceProps) {
  const [applications, setApplications] = useState<JobApplicationRecord[]>([])
  const [resumes, setResumes] = useState<SavedResumeRecord[]>([])
  const [contacts, setContacts] = useState<CareerContactRecord[]>([])
  const [jobDescriptions, setJobDescriptions] = useState<
    JobDescriptionRecord[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadAnalyticsSources() {
      setLoading(true)

      const [
        applicationsResponse,
        resumesResponse,
        contactsResponse,
        jobDescriptionsResponse,
      ] = await Promise.allSettled([
        fetch("/api/job-applications/list"),
        fetch("/api/resume/load"),
        fetch("/api/career-contacts/list"),
        fetch("/api/job-descriptions/list"),
      ])

      if (!mounted) {
        return
      }

      if (
        applicationsResponse.status === "fulfilled" &&
        applicationsResponse.value.ok
      ) {
        const payload = await applicationsResponse.value.json()
        setApplications(payload.applications || [])
      }

      if (resumesResponse.status === "fulfilled" && resumesResponse.value.ok) {
        const payload = await resumesResponse.value.json()
        setResumes(payload.resumes || [])
      }

      if (contactsResponse.status === "fulfilled" && contactsResponse.value.ok) {
        const payload = await contactsResponse.value.json()
        setContacts(payload.contacts || [])
      }

      if (
        jobDescriptionsResponse.status === "fulfilled" &&
        jobDescriptionsResponse.value.ok
      ) {
        const payload = await jobDescriptionsResponse.value.json()
        setJobDescriptions(payload.jobDescriptions || [])
      }

      setLoading(false)
    }

    loadAnalyticsSources()

    return () => {
      mounted = false
    }
  }, [])

  const model = useMemo(
    () =>
      buildInsightModel({
        area,
        applications,
        resumes,
        contacts,
        jobDescriptions,
      }),
    [area, applications, contacts, jobDescriptions, resumes],
  )

  const hasData =
    applications.length + resumes.length + contacts.length + jobDescriptions.length >
    0

  return (
    <section className="grid gap-5">
      <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
          <div>
            <div className="mb-4 flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
              <BarChart3 size={14} />
              {loading ? "Loading live stats" : "Live progress view"}
            </div>

            <h2 className="text-2xl font-black text-slate-950">
              {model.headline}
            </h2>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
              {model.summary}
            </p>
          </div>

          <div className="rounded-[28px] border border-blue-100 bg-blue-50 p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
              {model.scoreLabel}
            </p>
            <p className="mt-2 text-5xl font-black text-blue-950">
              {model.score}%
            </p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${model.score}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {!loading && !hasData && (
        <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-5">
          <h3 className="font-black text-amber-950">{model.emptyTitle}</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-amber-800">
            {model.emptyDescription}
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {model.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="Progress Indicators" icon={Target}>
          <div className="grid gap-4">
            {model.progress.map((item) => (
              <ProgressRow key={item.label} item={item} />
            ))}
          </div>
        </Panel>

        <Panel title={model.distributionTitle} icon={BriefcaseBusiness}>
          <div className="grid gap-3">
            {model.distribution.map((item) => (
              <DistributionRow key={item.label} item={item} />
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Recommended Next Actions" icon={CheckCircle2}>
          <div className="grid gap-3">
            {area.recommendedActions.map((item) => (
              <ChecklistItem key={item}>{item}</ChecklistItem>
            ))}
          </div>
        </Panel>

        <Panel title="What This Card Is Measuring" icon={FileText}>
          <div className="grid gap-3">
            {model.focusItems.map((item) => (
              <ChecklistItem key={item}>{item}</ChecklistItem>
            ))}
          </div>

          <Link
            href={area.sourceHref}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-black text-white transition hover:bg-blue-700"
          >
            Open {area.sourceLabel}
            <ArrowRight size={16} />
          </Link>
        </Panel>
      </div>
    </section>
  )
}

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <article className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {metric.label}
      </p>
      <p className="mt-3 text-3xl font-black text-slate-950">{metric.value}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
        {metric.detail}
      </p>
    </article>
  )
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: ComponentType<{ size?: number; className?: string }>
  children: ReactNode
}) {
  return (
    <article className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
          <Icon size={18} />
        </div>
        <h3 className="text-lg font-black text-slate-950">{title}</h3>
      </div>
      {children}
    </article>
  )
}

function ProgressRow({ item }: { item: ProgressItem }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-black text-slate-800">{item.label}</p>
        <p className="text-sm font-black text-blue-700">{item.value}%</p>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${item.value}%` }}
        />
      </div>
      <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
        {item.detail}
      </p>
    </div>
  )
}

function DistributionRow({ item }: { item: DistributionItem }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
      <span className="text-sm font-bold text-slate-700">{item.label}</span>
      <span className="text-sm font-black text-slate-950">{item.value}</span>
    </div>
  )
}

function ChecklistItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-sm font-semibold leading-6 text-slate-600">
      <CheckCircle2 size={15} className="mt-1 shrink-0 text-emerald-600" />
      <span>{children}</span>
    </div>
  )
}

function buildInsightModel({
  area,
  applications,
  resumes,
  contacts,
  jobDescriptions,
}: {
  area: AnalyticsDashboardInsightArea
  applications: JobApplicationRecord[]
  resumes: SavedResumeRecord[]
  contacts: CareerContactRecord[]
  jobDescriptions: JobDescriptionRecord[]
}): InsightModel {
  if (area.id === "resume-readiness") {
    return buildResumeReadinessModel(area, resumes, jobDescriptions)
  }

  if (area.id === "relationship-coverage") {
    return buildRelationshipCoverageModel(area, applications, contacts, jobDescriptions)
  }

  if (area.id === "prep-focus") {
    return buildPrepFocusModel(area, applications, resumes, jobDescriptions)
  }

  return buildApplicationMomentumModel(area, applications)
}

function buildApplicationMomentumModel(
  area: AnalyticsDashboardInsightArea,
  applications: JobApplicationRecord[],
): InsightModel {
  const analytics = analyzeJobTracker(applications)
  const activeCount =
    analytics.applied + analytics.followUp + analytics.interviewing + analytics.offers
  const score = clamp(
    Math.round(
      (Math.min(analytics.total, 20) / 20) * 35 +
        (analytics.responseRate / 100) * 30 +
        (analytics.interviewRate / 100) * 25 +
        (analytics.thisWeek.created > 0 || analytics.thisWeek.applied > 0 ? 10 : 0),
    ),
  )

  return {
    score,
    scoreLabel: "Momentum Score",
    headline: area.subtitle,
    summary:
      "This view measures whether the customer has enough active opportunities, whether roles are moving forward, and whether recent activity is creating pipeline motion.",
    metrics: [
      {
        label: "Applications",
        value: String(analytics.total),
        detail: `${activeCount} active roles across applied, follow-up, interviewing, and offer stages.`,
      },
      {
        label: "Response Rate",
        value: `${analytics.responseRate}%`,
        detail: "Share of applied roles that moved into follow-up, interview, or offer.",
      },
      {
        label: "Interview Rate",
        value: `${analytics.interviewRate}%`,
        detail: "Share of active applied roles that reached interview or offer.",
      },
      {
        label: "This Week",
        value: String(analytics.thisWeek.created + analytics.thisWeek.applied),
        detail: "New or applied roles added during the current week.",
      },
    ],
    progress: [
      {
        label: "Pipeline depth",
        value: clamp(Math.round((analytics.total / 20) * 100)),
        detail: "A healthy search usually needs enough tracked roles to reveal patterns.",
      },
      {
        label: "Employer response",
        value: analytics.responseRate,
        detail: "Shows whether applications are producing movement after submission.",
      },
      {
        label: "Interview conversion",
        value: analytics.interviewRate,
        detail: "Shows whether the resume and targeting are earning conversations.",
      },
    ],
    distributionTitle: "Pipeline Distribution",
    distribution: analytics.funnel.map((item) => ({
      label: item.label,
      value: item.count,
    })),
    focusItems: [
      "Job tracker stage counts",
      "Application response and interview conversion",
      "This week's new, applied, follow-up, interview, and offer movement",
      "Whether active roles have enough follow-up pressure",
    ],
    emptyTitle: "No applications tracked yet",
    emptyDescription:
      "Add roles in Job Tracker to start measuring pipeline volume, response rate, interview rate, and weekly movement.",
  }
}

function buildResumeReadinessModel(
  area: AnalyticsDashboardInsightArea,
  resumes: SavedResumeRecord[],
  jobDescriptions: JobDescriptionRecord[],
): InsightModel {
  const completeResumes = resumes.filter((resume) =>
    isResumeComplete(resume.resume_data),
  ).length
  const recentUpdates = resumes.filter((resume) =>
    isWithinDays(resume.updated_at, 14),
  ).length
  const totalSkills = new Set(
    resumes.flatMap((resume) => resume.resume_data?.skills || []),
  ).size
  const completionRate = rate(completeResumes, resumes.length)
  const score = clamp(
    Math.round(
      completionRate * 0.55 +
        Math.min(totalSkills * 4, 25) +
        (recentUpdates > 0 ? 10 : 0) +
        (jobDescriptions.length > 0 ? 10 : 0),
    ),
  )

  return {
    score,
    scoreLabel: "Readiness Score",
    headline: area.subtitle,
    summary:
      "This view measures whether the customer has usable resumes, enough skills and proof points, and recent updates tied to current target roles.",
    metrics: [
      {
        label: "Saved Resumes",
        value: String(resumes.length),
        detail: "Total resumes available for tailoring and export.",
      },
      {
        label: "Complete",
        value: `${completionRate}%`,
        detail: `${completeResumes} resumes include contact, summary, experience, and skills.`,
      },
      {
        label: "Skill Signals",
        value: String(totalSkills),
        detail: "Unique skills available across saved resumes.",
      },
      {
        label: "Updated Recently",
        value: String(recentUpdates),
        detail: "Resumes updated in the last 14 days.",
      },
    ],
    progress: [
      {
        label: "Resume completeness",
        value: completionRate,
        detail: "Measures whether saved resumes have the core sections needed to apply.",
      },
      {
        label: "Skills coverage",
        value: clamp(Math.round((totalSkills / 12) * 100)),
        detail: "More targeted skills give outreach, ATS, and interview prep better source material.",
      },
      {
        label: "Target role context",
        value: clamp(Math.round((jobDescriptions.length / 5) * 100)),
        detail: "Saved job descriptions help determine whether resumes match real opportunities.",
      },
    ],
    distributionTitle: "Resume Library",
    distribution: [
      { label: "Complete resumes", value: completeResumes },
      { label: "Needs work", value: Math.max(resumes.length - completeResumes, 0) },
      { label: "Recent updates", value: recentUpdates },
      { label: "Saved jobs to tailor against", value: jobDescriptions.length },
    ],
    focusItems: [
      "Resume count and completion",
      "Skills and certifications available for matching",
      "Recent resume maintenance",
      "Saved job descriptions available for tailoring",
    ],
    emptyTitle: "No resumes saved yet",
    emptyDescription:
      "Create or import a resume so analytics can measure completeness, skills coverage, and job-target readiness.",
  }
}

function buildRelationshipCoverageModel(
  area: AnalyticsDashboardInsightArea,
  applications: JobApplicationRecord[],
  contacts: CareerContactRecord[],
  jobDescriptions: JobDescriptionRecord[],
): InsightModel {
  const activeContacts = contacts.filter((contact) =>
    ["contacted", "active", "follow_up"].includes(contact.relationship_status),
  ).length
  const followUpsDue = contacts.filter((contact) =>
    isPastOrToday(contact.follow_up_at),
  ).length
  const targetCompanies = new Set(
    [
      ...applications.map((application) => application.company || ""),
      ...jobDescriptions.map((job) => normalizeJobCompany(job)),
    ]
      .map((company) => company.trim().toLowerCase())
      .filter(Boolean),
  )
  const coveredCompanies = new Set(
    contacts
      .map((contact) => contact.company || "")
      .map((company) => company.trim().toLowerCase())
      .filter((company) => company && targetCompanies.has(company)),
  )
  const coverageRate = rate(coveredCompanies.size, targetCompanies.size)
  const score = clamp(
    Math.round(
      Math.min(contacts.length * 7, 30) +
        coverageRate * 0.35 +
        rate(activeContacts, contacts.length) * 0.25 +
        (followUpsDue === 0 && contacts.length > 0 ? 10 : 0),
    ),
  )

  return {
    score,
    scoreLabel: "Coverage Score",
    headline: area.subtitle,
    summary:
      "This view measures whether target companies have relationship coverage and whether contacts are warm enough to support referrals, recruiter outreach, and check-ins.",
    metrics: [
      {
        label: "Contacts",
        value: String(contacts.length),
        detail: "Total people saved in Career CRM.",
      },
      {
        label: "Active",
        value: String(activeContacts),
        detail: "Contacts marked contacted, active, or follow-up.",
      },
      {
        label: "Follow-Ups Due",
        value: String(followUpsDue),
        detail: "Contacts with follow-up dates due today or earlier.",
      },
      {
        label: "Company Coverage",
        value: `${coverageRate}%`,
        detail: `${coveredCompanies.size} of ${targetCompanies.size} target companies have contacts.`,
      },
    ],
    progress: [
      {
        label: "Target company coverage",
        value: coverageRate,
        detail: "Shows how many active target companies have at least one related contact.",
      },
      {
        label: "Relationship warmth",
        value: rate(activeContacts, contacts.length),
        detail: "Shows how many saved contacts have progressed beyond a new record.",
      },
      {
        label: "Follow-up hygiene",
        value: contacts.length > 0 ? clamp(100 - rate(followUpsDue, contacts.length)) : 0,
        detail: "Higher means fewer overdue relationship actions.",
      },
    ],
    distributionTitle: "Contact Mix",
    distribution: [
      { label: "Recruiters", value: countContactsByType(contacts, "recruiter") },
      {
        label: "Hiring managers",
        value: countContactsByType(contacts, "hiring_manager"),
      },
      { label: "Networking", value: countContactsByType(contacts, "networking") },
      { label: "Mentors", value: countContactsByType(contacts, "mentor") },
    ],
    focusItems: [
      "Contacts by relationship type",
      "Target companies with and without people attached",
      "Overdue follow-up dates",
      "Relationship status progression",
    ],
    emptyTitle: "No contacts saved yet",
    emptyDescription:
      "Add recruiters, referral contacts, mentors, or hiring managers so analytics can show coverage and follow-up health.",
  }
}

function buildPrepFocusModel(
  area: AnalyticsDashboardInsightArea,
  applications: JobApplicationRecord[],
  resumes: SavedResumeRecord[],
  jobDescriptions: JobDescriptionRecord[],
): InsightModel {
  const interviewing = applications.filter(
    (application) => application.status === "interviewing",
  )
  const rolesWithSavedDescriptions = applications.filter(
    (application) => application.job_description_id,
  ).length
  const completeResumes = resumes.filter((resume) =>
    isResumeComplete(resume.resume_data),
  ).length
  const followUpReady = interviewing.filter(
    (application) => application.next_action || application.follow_up_at,
  ).length
  const score = clamp(
    Math.round(
      Math.min(interviewing.length * 20, 35) +
        rate(rolesWithSavedDescriptions, Math.max(applications.length, 1)) * 0.25 +
        rate(completeResumes, Math.max(resumes.length, 1)) * 0.25 +
        rate(followUpReady, Math.max(interviewing.length, 1)) * 0.15,
    ),
  )

  return {
    score,
    scoreLabel: "Prep Focus Score",
    headline: area.subtitle,
    summary:
      "This view measures how urgently the customer should practice, what role context is available, and whether interview-stage roles have next actions prepared.",
    metrics: [
      {
        label: "Interviewing",
        value: String(interviewing.length),
        detail: "Roles currently in the interview stage.",
      },
      {
        label: "Saved JDs",
        value: String(jobDescriptions.length),
        detail: "Job descriptions available for role-specific practice.",
      },
      {
        label: "Complete Resumes",
        value: String(completeResumes),
        detail: "Resumes with enough proof points to turn into interview stories.",
      },
      {
        label: "Follow-Up Ready",
        value: `${rate(followUpReady, interviewing.length)}%`,
        detail: "Interviewing roles with a next action or follow-up date.",
      },
    ],
    progress: [
      {
        label: "Interview urgency",
        value: clamp(Math.round((interviewing.length / 3) * 100)),
        detail: "More active interviews means prep should move higher in the weekly plan.",
      },
      {
        label: "Role-specific context",
        value: clamp(Math.round((jobDescriptions.length / 5) * 100)),
        detail: "Saved job descriptions make mock interview questions more relevant.",
      },
      {
        label: "Story bank readiness",
        value: rate(completeResumes, resumes.length),
        detail: "Complete resumes provide bullets that can become STAR or CAR stories.",
      },
    ],
    distributionTitle: "Prep Inputs",
    distribution: [
      { label: "Interviewing roles", value: interviewing.length },
      { label: "Roles linked to job descriptions", value: rolesWithSavedDescriptions },
      { label: "Saved job descriptions", value: jobDescriptions.length },
      { label: "Complete resumes", value: completeResumes },
    ],
    focusItems: [
      "Interview-stage job applications",
      "Saved job descriptions available for practice",
      "Resume proof points available for story answers",
      "Next actions and follow-up readiness after interviews",
    ],
    emptyTitle: "No prep signals yet",
    emptyDescription:
      "Add applications, saved job descriptions, or resumes so analytics can recommend the right interview practice focus.",
  }
}

function isResumeComplete(data?: ResumeBuilderFormData) {
  if (!data) {
    return false
  }

  const hasExperienceBullet = data.experience.some((item) =>
    item.bullets.some((bullet) => bullet.trim().length > 0),
  )

  return Boolean(
    data.contact.fullName &&
      data.summary &&
      hasExperienceBullet &&
      data.skills.length > 0,
  )
}

function countContactsByType(
  contacts: CareerContactRecord[],
  type: CareerContactRecord["contact_type"],
) {
  return contacts.filter((contact) => contact.contact_type === type).length
}

function normalizeJobCompany(job: JobDescriptionRecord) {
  return job.company || ""
}

function rate(numerator: number, denominator: number) {
  if (denominator <= 0) {
    return 0
  }

  return clamp(Math.round((numerator / denominator) * 100))
}

function clamp(value: number) {
  return Math.min(100, Math.max(0, value))
}

function isWithinDays(value: string | undefined, days: number) {
  if (!value) {
    return false
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return false
  }

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  return date >= cutoff
}

function isPastOrToday(value: string | null) {
  if (!value) {
    return false
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return false
  }

  const today = new Date()
  today.setHours(23, 59, 59, 999)

  return date <= today
}
