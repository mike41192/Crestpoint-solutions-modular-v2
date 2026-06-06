"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.5
// =====================================================

import type { JobApplicationRecord } from "@/modules/job-tracker"

import {
  analyzeJobTracker,
} from "@/modules/job-tracker-analytics"

import { JobTrackerMetricsGrid } from "./JobTrackerMetricsGrid"
import { JobTrackerFunnel } from "./JobTrackerFunnel"
import { JobTrackerWeeklyStats } from "./JobTrackerWeeklyStats"

// =====================================================
// BLOCK: Component Types
// =====================================================

type JobTrackerAnalyticsProps = {
  applications: JobApplicationRecord[]
}

// =====================================================
// BLOCK: Analytics Dashboard
// =====================================================

export function JobTrackerAnalytics({
  applications,
}: JobTrackerAnalyticsProps) {
  const analytics =
    analyzeJobTracker(applications)

  return (
    <div className="grid gap-5">
      <JobTrackerMetricsGrid analytics={analytics} />

      <div className="grid gap-5 xl:grid-cols-2">
        <JobTrackerFunnel analytics={analytics} />

        <JobTrackerWeeklyStats analytics={analytics} />
      </div>
    </div>
  )
}