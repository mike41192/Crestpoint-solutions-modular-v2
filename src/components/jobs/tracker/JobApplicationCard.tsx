"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.3
// =====================================================

import type { JobApplicationRecord } from "@/modules/job-tracker"

// =====================================================
// BLOCK: Component Types
// =====================================================

type JobApplicationCardProps = {
  application: JobApplicationRecord
  onOpen: (application: JobApplicationRecord) => void
}

// =====================================================
// BLOCK: Job Application Card
// =====================================================

export function JobApplicationCard({
  application,
  onOpen,
}: JobApplicationCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(application)}
      className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      <div>
        <p className="text-sm font-black text-slate-950">
          {application.title}
        </p>

        {application.company && (
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {application.company}
          </p>
        )}
      </div>

      {application.location && (
        <p className="mt-3 text-xs text-slate-500">{application.location}</p>
      )}

      {application.next_action && (
        <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-2">
          <p className="text-xs font-bold text-blue-700">Next Action</p>

          <p className="mt-1 text-xs text-blue-900">
            {application.next_action}
          </p>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span
          className={`rounded-full px-2 py-1 text-[10px] font-black uppercase ${
            application.priority === "high"
              ? "bg-red-50 text-red-700"
              : application.priority === "medium"
                ? "bg-amber-50 text-amber-700"
                : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {application.priority}
        </span>

        <span className="text-[10px] text-slate-400">
          {new Date(application.updated_at).toLocaleDateString()}
        </span>
      </div>
    </button>
  )
}
