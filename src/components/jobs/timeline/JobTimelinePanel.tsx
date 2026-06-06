"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.8
// =====================================================

import { History } from "lucide-react"
import type { JobApplicationEventRecord } from "@/modules/job-application-events"
import { JobApplicationTimeline } from "./JobApplicationTimeline"

// =====================================================
// BLOCK: Component Types
// =====================================================

type JobTimelinePanelProps = {
  events: JobApplicationEventRecord[]
}

// =====================================================
// BLOCK: Timeline Panel
// =====================================================

export function JobTimelinePanel({
  events,
}: JobTimelinePanelProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-violet-50 p-3 text-violet-700">
          <History size={20} />
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
            Activity Timeline
          </p>

          <h3 className="text-lg font-black text-slate-950">
            Application History
          </h3>
        </div>
      </div>

      <JobApplicationTimeline events={events} />
    </section>
  )
}