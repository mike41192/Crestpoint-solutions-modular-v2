"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.4
// =====================================================

import { CircleDashed } from "lucide-react"

import { JobApplicationCard } from "./JobApplicationCard"
import {
  JOB_TRACKER_COLUMN_DESCRIPTIONS,
  JOB_TRACKER_COLUMN_STYLES,
} from "./job-tracker-columns"
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
  const styles = JOB_TRACKER_COLUMN_STYLES[status]

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
      className={`flex min-h-[360px] flex-col rounded-[28px] border p-3 transition lg:min-h-[520px] ${
        isDragOver ? styles.drag : styles.surface
      }`}
    >
      <div className="mb-3 rounded-[22px] border border-white/70 bg-white/90 p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${styles.accent}`} />

              <h3 className={`truncate text-sm font-black ${styles.header}`}>
                {title}
              </h3>
            </div>

            <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
              {JOB_TRACKER_COLUMN_DESCRIPTIONS[status]}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black ${styles.count}`}
          >
            {applications.length}
          </span>
        </div>
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
          <div className="flex flex-1 flex-col items-center justify-center rounded-[22px] border border-dashed border-slate-300 bg-white/65 p-5 text-center text-xs font-bold text-slate-400">
            <CircleDashed size={22} className="mb-2 text-slate-300" />
            Drop applications here
          </div>
        )}
      </div>
    </div>
  )
}
