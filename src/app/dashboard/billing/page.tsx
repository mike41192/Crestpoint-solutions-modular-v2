"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CreditCard,
  FileText,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react"
import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import {
  createEmptyMembership,
  loadCurrentMembership,
} from "@/modules/membership-management/membership-service"
import type { MembershipData } from "@/modules/membership-management/types"
import {
  createEmptyUsage,
  loadCurrentUsage,
} from "@/modules/usage-tracking"
import type { UserUsageData } from "@/modules/usage-tracking"

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

function formatLimit(limit: number) {
  return limit < 0 ? "Unlimited" : limit.toLocaleString()
}

export default function BillingDashboardPage() {
  const [membership, setMembership] = useState<MembershipData>(
    createEmptyMembership(),
  )
  const [usage, setUsage] = useState<UserUsageData>(createEmptyUsage())
  const [savedResumeCount, setSavedResumeCount] = useState(0)
  const [trackedJobCount, setTrackedJobCount] = useState(0)
  const [loading, setLoading] = useState(true)

  async function refreshBillingData() {
    setLoading(true)

    const [
      membershipResult,
      usageResult,
      resumeCountResult,
      trackedJobCountResult,
    ] = await Promise.all([
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

  useEffect(() => {
    refreshBillingData()
  }, [])

  return (
    <ModulePageLayout
      moduleKey="billing_manager"
      title="Billing Dashboard"
      description="Review subscription access, usage limits, membership tiers, and billing controls."
    >
      <div className="grid gap-6">
        <section className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div>
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <ShieldCheck size={14} />
                Membership Control Center
              </div>

              <h2 className="text-3xl font-black tracking-tight">
                {loading ? "Loading plan..." : `${membership.planName} plan`}
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                Limits shown here come directly from the admin usage settings
                and refresh from Supabase each time this page loads.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={refreshBillingData}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-500 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-400"
                >
                  Refresh Usage
                </button>

                <Link
                  href="/dashboard/settings/billing"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15"
                >
                  Billing Settings
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/15 bg-white/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100">
                Status
              </p>

              <p className="mt-2 text-xl font-black capitalize">
                {membership.status}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Admin-configured limits are applied to module access and usage
                enforcement.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <UsageCard
            title="Saved Resumes"
            icon={FileText}
            used={savedResumeCount}
            limit={membership.resumeLimit}
            href="/dashboard/resumes"
          />

          <UsageCard
            title="ATS Scans"
            icon={Target}
            used={usage.atsScansUsed}
            limit={membership.atsLimit}
            href="/dashboard/ats"
          />

          <UsageCard
            title="AI Rewrites"
            icon={Sparkles}
            used={usage.aiRewritesUsed}
            limit={membership.rewriteLimit}
            href="/dashboard/resume"
          />

          <UsageCard
            title="Tracked Jobs"
            icon={BriefcaseBusiness}
            used={trackedJobCount}
            limit={membership.trackedJobsLimit}
            href="/dashboard/jobs"
          />

          <UsageCard
            title="Mock Interviews"
            icon={MessageSquare}
            used={0}
            limit={membership.mockInterviewLimit}
            href="/dashboard/interview"
          />

          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-700 w-fit">
              <CreditCard size={20} />
            </div>

            <h2 className="mt-4 text-lg font-black text-slate-950">
              Stripe Portal
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Subscription checkout and billing portal controls are ready for
              the Stripe integration pass.
            </p>
          </article>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
              <BarChart3 size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-950">
                Limit Source
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Current limits: resumes {formatLimit(membership.resumeLimit)},
                ATS scans {formatLimit(membership.atsLimit)}, AI rewrites{" "}
                {formatLimit(membership.rewriteLimit)}, tracked jobs{" "}
                {formatLimit(membership.trackedJobsLimit)}, mock interviews{" "}
                {formatLimit(membership.mockInterviewLimit)}.
              </p>
            </div>
          </div>
        </section>
      </div>
    </ModulePageLayout>
  )
}

function UsageCard({
  title,
  icon: Icon,
  used,
  limit,
  href,
}: {
  title: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  used: number
  limit: number
  href: string
}) {
  const isUnlimited = limit < 0
  const safeLimit = Math.max(limit, 1)
  const percent = isUnlimited
    ? 100
    : Math.min(Math.round((used / safeLimit) * 100), 100)

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
          <Icon size={20} />
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
          {isUnlimited ? "Unlimited" : `${percent}%`}
        </span>
      </div>

      <h2 className="mt-4 text-lg font-black text-slate-950">{title}</h2>

      <p className="mt-2 text-sm font-semibold text-slate-500">
        {isUnlimited ? `${used} used` : `${used} of ${limit} used`}
      </p>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${percent}%` }}
        />
      </div>

      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-2 text-sm font-black text-blue-700 transition hover:text-blue-900"
      >
        Open Module
        <ArrowRight size={16} />
      </Link>
    </article>
  )
}
