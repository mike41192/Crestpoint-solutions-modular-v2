"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.5
// =====================================================

import { BarChart3, BriefcaseBusiness, CheckCircle2, Send, XCircle } from "lucide-react"
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
}: {
  title: string
  value: string | number
  helper: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>

          <p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
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
      />

      <MetricCard
        title="Applied"
        value={analytics.applied + analytics.followUp + analytics.interviewing + analytics.offers}
        helper="Submitted or actively progressing."
        icon={Send}
      />

      <MetricCard
        title="Interview Rate"
        value={`${analytics.interviewRate}%`}
        helper="Interviewing or offer count vs active applications."
        icon={BarChart3}
      />

      <MetricCard
        title="Offers"
        value={analytics.offers}
        helper="Applications that reached offer stage."
        icon={CheckCircle2}
      />

      <MetricCard
        title="Response Rate"
        value={`${analytics.responseRate}%`}
        helper="Follow-up, interview, and offer activity."
        icon={BarChart3}
      />

      <MetricCard
        title="Rejections"
        value={analytics.rejected}
        helper={`Rejection rate: ${analytics.rejectionRate}%.`}
        icon={XCircle}
      />

      <MetricCard
        title="Saved"
        value={analytics.saved}
        helper="Jobs saved for review."
        icon={BriefcaseBusiness}
      />

      <MetricCard
        title="Follow Ups"
        value={analytics.followUp}
        helper="Applications needing action."
        icon={Send}
      />
    </section>
  )
}