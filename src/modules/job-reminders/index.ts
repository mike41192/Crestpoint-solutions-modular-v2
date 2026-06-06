// =====================================================
// BLOCK: Job Reminder Engine
// Crestpoint Solutions V2
// Version: 1.9.6
// =====================================================

import type { JobApplicationRecord } from "@/modules/job-tracker"

// =====================================================
// BLOCK: Types
// =====================================================

export type JobReminderStatus = "none" | "upcoming" | "due_today" | "overdue"

export type JobReminderItem = {
  application: JobApplicationRecord
  status: JobReminderStatus
  label: string
  daysUntilFollowUp: number | null
}

// =====================================================
// BLOCK: Date Helpers
// =====================================================

function getStartOfToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return today
}

function getDaysUntil(value: string | null): number | null {
  if (!value) return null

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return null

  const today = getStartOfToday()
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)

  const difference = target.getTime() - today.getTime()

  return Math.round(difference / 86_400_000)
}

function getReminderStatus(daysUntil: number | null): JobReminderStatus {
  if (daysUntil === null) return "none"
  if (daysUntil < 0) return "overdue"
  if (daysUntil === 0) return "due_today"
  if (daysUntil <= 7) return "upcoming"

  return "none"
}

function getReminderLabel(status: JobReminderStatus, daysUntil: number | null) {
  if (status === "overdue") {
    return `${Math.abs(daysUntil || 0)} day(s) overdue`
  }

  if (status === "due_today") {
    return "Follow up today"
  }

  if (status === "upcoming") {
    return `Follow up in ${daysUntil} day(s)`
  }

  return "No reminder"
}

// =====================================================
// BLOCK: Public Reminder Analyzer
// =====================================================

export function analyzeJobReminders(
  applications: JobApplicationRecord[],
): JobReminderItem[] {
  return applications
    .map((application) => {
      const daysUntilFollowUp = getDaysUntil(application.follow_up_at)
      const status = getReminderStatus(daysUntilFollowUp)

      return {
        application,
        status,
        label: getReminderLabel(status, daysUntilFollowUp),
        daysUntilFollowUp,
      }
    })
    .filter((item) => item.status !== "none")
    .sort((a, b) => {
      const aDays = a.daysUntilFollowUp ?? 999
      const bDays = b.daysUntilFollowUp ?? 999

      return aDays - bDays
    })
}

export function getJobReminderStatus(
  application: JobApplicationRecord,
): JobReminderStatus {
  return getReminderStatus(getDaysUntil(application.follow_up_at))
}

export function getJobReminderLabel(
  application: JobApplicationRecord,
): string {
  const daysUntilFollowUp = getDaysUntil(application.follow_up_at)

  return getReminderLabel(
    getReminderStatus(daysUntilFollowUp),
    daysUntilFollowUp,
  )
}