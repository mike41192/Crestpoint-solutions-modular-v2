// =====================================================
// BLOCK: Job Tracker Analytics Engine
// Crestpoint Solutions V2
// Version: 1.9.5
// =====================================================

import type {
  JobApplicationRecord,
  JobApplicationStatus,
} from "@/modules/job-tracker"

// =====================================================
// BLOCK: Types
// =====================================================

export type JobTrackerAnalyticsResult = {
  total: number
  saved: number
  applied: number
  followUp: number
  interviewing: number
  offers: number
  rejected: number
  archived: number

  responseRate: number
  interviewRate: number
  offerRate: number
  rejectionRate: number

  thisWeek: {
    created: number
    applied: number
    interviewing: number
    offers: number
    followUps: number
  }

  funnel: {
    label: string
    status: JobApplicationStatus
    count: number
    percent: number
  }[]
}

// =====================================================
// BLOCK: Helpers
// =====================================================

function countByStatus(
  applications: JobApplicationRecord[],
  status: JobApplicationStatus,
): number {
  return applications.filter((application) => application.status === status)
    .length
}

function calculateRate(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0

  return Math.round((numerator / denominator) * 100)
}

function isThisWeek(value: string | null): boolean {
  if (!value) return false

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return false

  const now = new Date()
  const startOfWeek = new Date(now)

  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  return date >= startOfWeek
}

// =====================================================
// BLOCK: Public Analytics Function
// =====================================================

export function analyzeJobTracker(
  applications: JobApplicationRecord[],
): JobTrackerAnalyticsResult {
  const total = applications.length

  const saved = countByStatus(applications, "saved")
  const applied = countByStatus(applications, "applied")
  const followUp = countByStatus(applications, "follow_up")
  const interviewing = countByStatus(applications, "interviewing")
  const offers = countByStatus(applications, "offer")
  const rejected = countByStatus(applications, "rejected")
  const archived = countByStatus(applications, "archived")

  const activeAppliedBase = applied + followUp + interviewing + offers + rejected
  const responseCount = followUp + interviewing + offers

  const funnel = [
    {
      label: "Saved",
      status: "saved" as JobApplicationStatus,
      count: saved,
      percent: calculateRate(saved, total),
    },
    {
      label: "Applied",
      status: "applied" as JobApplicationStatus,
      count: applied,
      percent: calculateRate(applied, total),
    },
    {
      label: "Follow Up",
      status: "follow_up" as JobApplicationStatus,
      count: followUp,
      percent: calculateRate(followUp, total),
    },
    {
      label: "Interviewing",
      status: "interviewing" as JobApplicationStatus,
      count: interviewing,
      percent: calculateRate(interviewing, total),
    },
    {
      label: "Offer",
      status: "offer" as JobApplicationStatus,
      count: offers,
      percent: calculateRate(offers, total),
    },
  ]

  return {
    total,
    saved,
    applied,
    followUp,
    interviewing,
    offers,
    rejected,
    archived,

    responseRate: calculateRate(responseCount, activeAppliedBase),
    interviewRate: calculateRate(interviewing + offers, activeAppliedBase),
    offerRate: calculateRate(offers, interviewing + offers),
    rejectionRate: calculateRate(rejected, activeAppliedBase),

    thisWeek: {
      created: applications.filter((application) =>
        isThisWeek(application.created_at),
      ).length,
      applied: applications.filter((application) =>
        isThisWeek(application.applied_at || application.updated_at),
      ).length,
      interviewing: applications.filter(
        (application) =>
          application.status === "interviewing" &&
          isThisWeek(application.interview_at || application.updated_at),
      ).length,
      offers: applications.filter(
        (application) =>
          application.status === "offer" && isThisWeek(application.updated_at),
      ).length,
      followUps: applications.filter(
        (application) =>
          application.status === "follow_up" &&
          isThisWeek(application.follow_up_at || application.updated_at),
      ).length,
    },

    funnel,
  }
}
