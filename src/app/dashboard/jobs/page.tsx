"use client"

import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { JobTrackerBoard } from "@/components/jobs/tracker/JobTrackerBoard"

export default function JobTrackerPage() {
  return (
    <ModulePageLayout
      title="Job Tracker"
      description="Track every application from saved to offer using the Crestpoint Kaizen workflow."
    >
      <JobTrackerBoard />
    </ModulePageLayout>
  )
}
