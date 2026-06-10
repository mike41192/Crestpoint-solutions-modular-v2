"use client"

import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { JobTrackerDashboard } from "@/components/jobs/tracker/JobTrackerDashboard"

export default function JobTrackerPage() {
  return (
    <ModulePageLayout
      moduleKey="job_tracker"
      title="Job Tracker"
      description="Track every application from saved to offer using the Crestpoint Kaizen workflow."
    >
      <JobTrackerDashboard />
    </ModulePageLayout>
  )
}
