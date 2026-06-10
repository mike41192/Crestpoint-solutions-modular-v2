"use client"

// =====================================================
// BLOCK: React Imports
// =====================================================

import { useEffect, useState } from "react"
import Link from "next/link"

// =====================================================
// BLOCK: Icon Imports
// =====================================================

import {
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  FileText,
  MessageSquare,
  Sparkles,
  Target,
} from "lucide-react"

// =====================================================
// BLOCK: Layout Imports
// =====================================================

import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { SettingsPageShell } from "@/components/settings/SettingsPageShell"

// =====================================================
// BLOCK: Membership Imports
// =====================================================

import {
  createEmptyMembership,
  loadCurrentMembership,
} from "@/modules/membership-management/membership-service"
import type { MembershipData } from "@/modules/membership-management/types"

// =====================================================
// BLOCK: Usage Tracking Imports
// =====================================================

import {
  createEmptyUsage,
  loadCurrentUsage,
} from "@/modules/usage-tracking"
import type { UserUsageData } from "@/modules/usage-tracking"

// =====================================================
// BLOCK: Resume Count Helper
// =====================================================

async function loadSavedResumeCount(): Promise<number> {
  try {
    const response = await fetch("/api/resume/load", {
      cache: "no-store",
    })
    const result = await response.json()

    if (result.status !== "success") {
      return 0
    }

    return Array.isArray(result.resumes) ? result.resumes.length : 0
  } catch {
    return 0
  }
}

async function loadTrackedJobCount(): Promise<number> {
  try {
    const response = await fetch("/api/job-applications/list", {
      cache: "no-store",
    })
    const result = await response.json()

    if (result.status !== "success") {
      return 0
    }

    return Array.isArray(result.applications)
      ? result.applications.length
      : 0
  } catch {
    return 0
  }
}

// =====================================================
// BLOCK: Billing Settings Page
// =====================================================

export default function BillingSettingsPage() {
  const [membership, setMembership] = useState<MembershipData>(
    createEmptyMembership(),
  )

  const [usage, setUsage] = useState<UserUsageData>(createEmptyUsage())
  const [savedResumeCount, setSavedResumeCount] = useState(0)
  const [trackedJobCount, setTrackedJobCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMembershipData() {
      const [
        membershipResult,
        usageResult,
        resumeCountResult,
        trackedJobCountResult,
      ] =
        await Promise.all([
          loadCurrentMembership(),
          loadCurrentUsage(),
          loadSavedResumeCount(),
          loadTrackedJobCount(),
        ])

      setMembership(membershipResult)
      setUsage(usageResult)
      setSavedResumeCount(resumeCountResult)
      setTrackedJobCount(trackedJobCountResult)
      setLoading(false)
    }

    loadMembershipData()
  }, [])

  return (
    <ModulePageLayout
      title="Membership Access"
      description="Manage your Crestpoint subscription and membership access."
    >
      <SettingsPageShell
        eyebrow="Account Settings"
        title="Membership Access"
        description="View your current plan, module access, and future billing controls."
      >
        <div className="grid gap-5">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                  <CreditCard size={20} />
                </div>

                <div>
                <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                  <CreditCard size={14} />
                  Current Plan
                </div>

                <h3 className="text-2xl font-black capitalize text-slate-950">
                  {loading ? "Loading..." : membership.planName}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Your membership controls access to Crestpoint resume, ATS,
                  interview, and career optimization modules.
                </p>
                </div>
              </div>

              <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
                  Status
                </p>

                <p className="mt-2 text-lg font-black capitalize text-emerald-900">
                  {membership.status}
                </p>

                <p className="mt-1 text-sm font-semibold text-emerald-700">
                  Billing portal coming soon
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-3">
            <UsageCard
              title="Saved Resumes"
              icon={FileText}
              used={savedResumeCount}
              limit={membership.resumeLimit}
              actionHref="/dashboard/resumes"
              actionLabel="Open Resume Library"
            />

            <UsageCard
              title="ATS Scans"
              icon={Target}
              used={usage.atsScansUsed}
              limit={membership.atsLimit}
            />

            <UsageCard
              title="AI Rewrites"
              icon={Sparkles}
              used={usage.aiRewritesUsed}
              limit={membership.rewriteLimit}
            />

            <UsageCard
              title="Tracked Jobs"
              icon={BriefcaseBusiness}
              used={trackedJobCount}
              limit={membership.trackedJobsLimit}
              actionHref="/dashboard/jobs"
              actionLabel="Open Job Tracker"
            />

            <UsageCard
              title="Mock Interviews"
              icon={MessageSquare}
              used={0}
              limit={membership.mockInterviewLimit}
              actionHref="/dashboard/interview"
              actionLabel="Open Interviewer"
            />
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-blue-700" />
              <h3 className="text-lg font-black text-slate-950">
                Module Access
              </h3>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {[
                "Resume Builder",
                "ATS Scoring",
                "AI Resume Optimization",
                "Interview Prep",
                "Resume Library",
                "Version History",
              ].map((module) => (
                <div
                  key={module}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <CheckCircle2 size={17} className="text-emerald-600" />

                  <p className="text-sm font-black text-slate-800">
                    {module}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-white p-3 text-amber-700 shadow-sm">
                <CreditCard size={20} />
              </div>

              <div>
                <h3 className="text-lg font-black text-amber-950">
                  Billing Portal Coming Soon
                </h3>

                <p className="mt-2 text-sm leading-6 text-amber-800">
                  Stripe checkout, subscription management, plan upgrades, and
                  invoice access will be connected during the billing
                  integration phase.
                </p>
              </div>
            </div>
          </section>
        </div>
      </SettingsPageShell>
    </ModulePageLayout>
  )
}

// =====================================================
// BLOCK: Usage Card Component
// =====================================================

function UsageCard({
  title,
  icon: Icon,
  used,
  limit,
  actionHref,
  actionLabel,
}: {
  title: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  used: number
  limit: number
  actionHref?: string
  actionLabel?: string
}) {
  const isUnlimited = limit < 0
  const safeLimit = Math.max(limit, 1)
  const percent = isUnlimited
    ? 0
    : Math.min(Math.round((used / safeLimit) * 100), 100)

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
          <Icon size={20} />
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
          {isUnlimited ? "Unlimited" : `${percent}%`}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>

      <p className="mt-1 text-sm font-semibold text-slate-500">
        {isUnlimited ? `${used} used` : `${used} of ${limit} used`}
      </p>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{
            width: `${isUnlimited ? 100 : percent}%`,
          }}
        />
      </div>

      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-4 inline-flex items-center gap-2 text-sm font-black text-blue-700 hover:text-blue-900"
        >
          {actionLabel}
          <ExternalLink size={14} />
        </Link>
      )}
    </div>
  )
}
