import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"

export default function ResumeDashboardPage() {
  return (
    <ModulePageLayout
      title="Resume Builder"
      description="Build, import, optimize, and export professional resumes."
    >
      <FirstUseTutorial moduleKey="resume_builder" />
    </ModulePageLayout>
  )
}