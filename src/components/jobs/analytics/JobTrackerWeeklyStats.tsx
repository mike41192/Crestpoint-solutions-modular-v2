"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.5
// =====================================================

import type { JobTrackerAnalyticsResult } from "@/modules/job-tracker-analytics"

// =====================================================
// BLOCK: Component Types
// =====================================================

type JobTrackerWeeklyStatsProps = {
  analytics: JobTrackerAnalyticsResult
}

// =====================================================
// BLOCK: Weekly Stats Component
// =====================================================

export function JobTrackerWeeklyStats({
  analytics,
}: JobTrackerWeeklyStatsProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
          Weekly Activity
        </p>

        <h3 className="mt-2 text-xl font-black text-slate-950">
          Kaizen Progress
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Small improvements compound over time.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase text-slate-500">
            Created This Week
          </p>

          <p className="mt-2 text-3xl font-black text-slate-950">
            {analytics.thisWeek.created}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase text-slate-500">
            Applied This Week
          </p>

          <p className="mt-2 text-3xl font-black text-slate-950">
            {analytics.thisWeek.applied}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase text-slate-500">
            Interviews This Week
          </p>

          <p className="mt-2 text-3xl font-black text-slate-950">
            {analytics.thisWeek.interviewing}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase text-slate-500">
            Offers This Week
          </p>

          <p className="mt-2 text-3xl font-black text-slate-950">
            {analytics.thisWeek.offers}
          </p>
        </div>
      </div>
    </section>
  )
}