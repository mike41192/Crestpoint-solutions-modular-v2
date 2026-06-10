// =====================================================
// BLOCK: Layout Imports
// Crestpoint Solutions V2
// Version: 1.8.3
// =====================================================

import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { JobDescriptionLibrary } from "@/components/jobs/JobDescriptionLibrary"

// =====================================================
// BLOCK: Job Descriptions Page
// =====================================================

export default function JobDescriptionsPage() {
  return (
    <ModulePageLayout
      moduleKey="job_description_library"
      title="Job Description Library"
      description="Save, search, edit, and reuse job descriptions for ATS scoring, resume tailoring, and future job-tracker workflows."
    >
      <JobDescriptionLibrary />
    </ModulePageLayout>
  )
}
