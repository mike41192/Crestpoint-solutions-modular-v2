import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"

export default function ATSDashboardPage() {
  return (
    <ModulePageLayout
      title="ATS Scoring"
      description="Score your resume against job descriptions and improve keyword alignment."
    >
      <FirstUseTutorial moduleKey="ats_scoring" />
    </ModulePageLayout>
  )
}