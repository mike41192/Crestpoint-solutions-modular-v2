"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.8
// =====================================================

import { JobTimelineEventCard } from "./JobTimelineEventCard"
import type { JobApplicationEventRecord } from "@/modules/job-application-events"

// =====================================================
// BLOCK: Component Types
// =====================================================

type JobApplicationTimelineProps = {
  events: JobApplicationEventRecord[]
}

// =====================================================
// BLOCK: Timeline
// =====================================================

export function JobApplicationTimeline({
  events,
}: JobApplicationTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-semibold text-slate-500">
        No timeline activity recorded yet.
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {events.map((event) => (
        <JobTimelineEventCard
          key={event.id}
          event={event}
        />
      ))}
    </div>
  )
}
