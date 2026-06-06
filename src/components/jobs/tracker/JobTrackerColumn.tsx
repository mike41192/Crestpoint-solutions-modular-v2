"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.4
// =====================================================

import { JobApplicationCard } from "./JobApplicationCard"
import type {
  JobApplicationRecord,
  JobApplicationStatus,
} from "@/modules/job-tracker"

// =====================================================
// BLOCK: Component Types
// =====================================================

type JobTrackerColumnProps = {
  title: string
  status: JobApplicationStatus
  applications: JobApplicationRecord[]
  isDragOver: boolean
  onOpenApplication: (application: JobApplicationRecord) => void
  onDragStart: (application: JobApplicationRecord) => void
  onDragEnd: () => void
  onDragOver: (status: JobApplicationStatus) => void
  onDragLeave: (status: JobApplicationStatus) => void
  onDrop: (status: JobApplicationStatus) => void
}

// =====================================================
// BLOCK: Job Tracker Column
// =====================================================

export function JobTrackerColumn({
  title,
  status,
  applications,
  isDragOver,
  onOpenApplication,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: JobTrackerColumnProps) {
  return (
    <div
      onDragOver={(event) => {
        event.preventDefault()
        onDragOver(status)
      }}
      onDragLeave={() => onDragLeave(status)}
      onDrop={(event) => {
        event.preventDefault()
        onDrop(status)
      }}
      className={`flex min-h-[600px] flex-col rounded-3xl border p-4 transition ${
        isDragOver
          ? "border-blue-300 bg-blue-50 shadow-md"
          : "border-slate-200 bg-slate-50"
      }`}
    >
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
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}

        {applications.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 p-4 text-center text-xs font-bold text-slate-400">
            Drop jobs here
          </div>
        )}
      </div>
    </div>
  )
}
