"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.6
// =====================================================

import { JobReminderPanel } from "@/components/jobs/reminders/JobReminderPanel"
import { JobTrackerAnalytics } from "@/components/jobs/analytics/JobTrackerAnalytics"
import { JobTrackerBoard } from "@/components/jobs/tracker/JobTrackerBoard"
import type { JobApplicationRecord } from "@/modules/job-tracker"

// =====================================================
// BLOCK: Component Types
// =====================================================

type JobTrackerWorkspaceProps = {
  applications: JobApplicationRecord[]
  onApplicationsChange: (applications: JobApplicationRecord[]) => void
  onOpenApplication: (application: JobApplicationRecord) => void
}

// =====================================================
// BLOCK: Job Tracker Workspace
// =====================================================

export function JobTrackerWorkspace({
  applications,
  onApplicationsChange,
  onOpenApplication,
}: JobTrackerWorkspaceProps) {
  return (
    <div className="grid gap-6">
      <JobTrackerAnalytics applications={applications} />

      <JobReminderPanel
        applications={applications}
        onOpenApplication={onOpenApplication}
      />

      <JobTrackerBoard
        initialApplications={applications}
        onApplicationsChange={onApplicationsChange}
        onOpenApplication={onOpenApplication}
      />
    </div>
  )
}