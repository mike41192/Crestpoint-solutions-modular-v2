"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.5
// =====================================================

import {
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Send,
  Target,
  XCircle,
} from "lucide-react"
import type { JobTrackerAnalyticsResult } from "@/modules/job-tracker-analytics"

// =====================================================
// BLOCK: Component Types
// =====================================================

type JobTrackerMetricsGridProps = {
  analytics: JobTrackerAnalyticsResult
}

// =====================================================
// BLOCK: Metric Card
// =====================================================

function MetricCard({
  title,
  value,
  helper,
  icon: Icon,
  tone = "blue",
}: {
  title: string
  value: string | number
  helper: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  tone?: "blue" | "emerald" | "amber" | "rose" | "slate"
}) {
  const toneClass = {
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    slate: "bg-slate-100 text-slate-700",
  }[tone]

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>

          <p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p>
        </div>

        <div className={`rounded-2xl p-3 ${toneClass}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}

// =====================================================
// BLOCK: Metrics Grid Component
// =====================================================

export function JobTrackerMetricsGrid({
  analytics,
}: JobTrackerMetricsGridProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="Total Jobs"
        value={analytics.total}
        helper="All tracked applications."
        icon={BriefcaseBusiness}
        tone="slate"
      />

      <MetricCard
        title="Applied"
        value={analytics.applied + analytics.followUp + analytics.interviewing + analytics.offers}
        helper="Submitted or actively progressing."
        icon={Send}
        tone="blue"
      />

      <MetricCard
        title="Interview Rate"
        value={`${analytics.interviewRate}%`}
        helper="Interviewing or offer count vs active applications."
        icon={Target}
        tone="amber"
      />

      <MetricCard
        title="Offers"
        value={analytics.offers}
        helper="Applications that reached offer stage."
        icon={CheckCircle2}
        tone="emerald"
      />

      <MetricCard
        title="Response Rate"
        value={`${analytics.responseRate}%`}
        helper="Follow-up, interview, and offer activity."
        icon={BarChart3}
        tone="blue"
      />

      <MetricCard
        title="Rejections"
        value={analytics.rejected}
        helper={`Rejection rate: ${analytics.rejectionRate}%.`}
        icon={XCircle}
        tone="rose"
      />

      <MetricCard
        title="Saved"
        value={analytics.saved}
        helper="Jobs saved for review."
        icon={BriefcaseBusiness}
        tone="slate"
      />

      <MetricCard
        title="Follow Ups"
        value={analytics.followUp}
        helper="Applications needing action."
        icon={Send}
        tone="amber"
      />
    </section>
  )
}
