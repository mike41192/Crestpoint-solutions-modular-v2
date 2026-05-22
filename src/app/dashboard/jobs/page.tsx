import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"

export default function JobsDashboardPage() {
  return (
    <ModulePageLayout
      title="Job Tracker"
      description="Track applications, interviews, follow-ups, recruiters, offers, and job-search progress."
    >
      <FirstUseTutorial moduleKey="job_tracker" />
    </ModulePageLayout>
  )
}