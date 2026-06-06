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

type JobTrackerFunnelProps = {
  analytics: JobTrackerAnalyticsResult
}

// =====================================================
// BLOCK: Funnel Component
// =====================================================

export function JobTrackerFunnel({
  analytics,
}: JobTrackerFunnelProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
          Conversion Funnel
        </p>

        <h3 className="mt-2 text-xl font-black text-slate-950">
          Job Search Pipeline
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Track how applications move through your career pipeline.
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        {analytics.funnel.map((item) => (
          <div
            key={item.status}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-slate-950">
                  {item.label}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {item.count} applications
                </p>
              </div>

              <p className="text-sm font-black text-violet-700">
                {item.percent}%
              </p>
            </div>

            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-violet-600 transition-all"
                style={{
                  width: `${Math.max(item.percent, 3)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}