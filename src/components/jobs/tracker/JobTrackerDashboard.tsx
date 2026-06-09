"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.6
// =====================================================

import { useEffect, useState } from "react"
import { BriefcaseBusiness } from "lucide-react"

import { JobTrackerWorkspace } from "@/components/jobs/tracker/JobTrackerWorkspace"
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
  const [selectedApplication, setSelectedApplication] =
    useState<JobApplicationRecord | null>(null)

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
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <BriefcaseBusiness size={22} />
          </div>

          <div>
            <p className="text-sm font-black text-slate-950">
              Loading job tracker
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              Pulling your saved applications, reminders, and pipeline history.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <JobTrackerWorkspace
        applications={applications}
        onApplicationsChange={setApplications}
        onOpenApplication={setSelectedApplication}
      />

      {selectedApplication && (
        <div className="hidden">
          Selected application: {selectedApplication.id}
        </div>
      )}
    </div>
  )
}
