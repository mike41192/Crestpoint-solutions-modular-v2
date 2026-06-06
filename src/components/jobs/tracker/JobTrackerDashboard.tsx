"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.5
// =====================================================

import { useEffect, useState } from "react"
import { JobTrackerAnalytics } from "@/components/jobs/analytics/JobTrackerAnalytics"
import { JobTrackerBoard } from "@/components/jobs/tracker/JobTrackerBoard"
import {
  listJobApplications,
  type JobApplicationRecord,
} from "@/modules/job-tracker"

// =====================================================
// BLOCK: Job Tracker Dashboard
// =====================================================

export function JobTrackerDashboard() {
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<JobApplicationRecord[]>([])

  async function loadApplications() {
    try {
      const data = await listJobApplications()
      setApplications(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplications()
  }, [])

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm font-bold text-slate-500 shadow-sm">
        Loading job tracker dashboard...
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <JobTrackerAnalytics applications={applications} />

      <JobTrackerBoard
        initialApplications={applications}
        onApplicationsChange={setApplications}
      />
    </div>
  )
}