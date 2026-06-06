"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.6
// =====================================================

import { Clock } from "lucide-react"
import {
  getJobReminderLabel,
  getJobReminderStatus,
} from "@/modules/job-reminders"
import type { JobApplicationRecord } from "@/modules/job-tracker"

// =====================================================
// BLOCK: Component Types
// =====================================================

type JobReminderBadgeProps = {
  application: JobApplicationRecord
}

// =====================================================
// BLOCK: Job Reminder Badge
// =====================================================

export function JobReminderBadge({ application }: JobReminderBadgeProps) {
  const status = getJobReminderStatus(application)

  if (status === "none") {
    return null
  }

  const classes =
    status === "overdue"
      ? "border-red-200 bg-red-50 text-red-700"
      : status === "due_today"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-blue-200 bg-blue-50 text-blue-700"

  return (
    <div
      className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black ${classes}`}
    >
      <Clock size={12} />
      {getJobReminderLabel(application)}
    </div>
  )
}
