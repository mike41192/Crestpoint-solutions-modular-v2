"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.8
// =====================================================

import type { JobApplicationEventRecord } from "@/modules/job-application-events"

// =====================================================
// BLOCK: Component Types
// =====================================================

type JobTimelineEventCardProps = {
  event: JobApplicationEventRecord
}

// =====================================================
// BLOCK: Event Card
// =====================================================

export function JobTimelineEventCard({
  event,
}: JobTimelineEventCardProps) {
  return (
    <div className="relative pl-8">
      <div className="absolute left-2 top-2 h-full w-px bg-slate-200" />

      <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-violet-500 bg-white" />

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-black text-slate-950">
            {event.event_type.replaceAll("_", " ")}
          </p>

          <span className="text-xs text-slate-500">
            {new Date(event.created_at).toLocaleString()}
          </span>
        </div>

        {event.from_status && event.to_status && (
          <p className="mt-2 text-sm text-slate-600">
            {event.from_status} → {event.to_status}
          </p>
        )}

        {event.note && (
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {event.note}
          </p>
        )}
      </div>
    </div>
  )
}