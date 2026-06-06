"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.3
// =====================================================

import { JobApplicationCard } from "./JobApplicationCard"
import type { JobApplicationRecord } from "@/modules/job-tracker"

// =====================================================
// BLOCK: Component Types
// =====================================================

type JobTrackerColumnProps = {
  title: string
  applications: JobApplicationRecord[]
  onOpenApplication: (application: JobApplicationRecord) => void
}

// =====================================================
// BLOCK: Job Tracker Column
// =====================================================

export function JobTrackerColumn({
  title,
  applications,
  onOpenApplication,
}: JobTrackerColumnProps) {
  return (
    <div className="flex min-h-[600px] flex-col rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-black text-slate-950">{title}</h3>

        <p className="mt-1 text-xs text-slate-500">
          {applications.length} jobs
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        {applications.map((application) => (
          <JobApplicationCard
            key={application.id}
            application={application}
            onOpen={onOpenApplication}
          />
        ))}
      </div>
    </div>
  )
}
