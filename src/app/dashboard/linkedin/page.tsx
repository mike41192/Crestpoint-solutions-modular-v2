import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"

export default function LinkedInDashboardPage() {
  return (
    <ModulePageLayout
      title="LinkedIn Optimizer"
      description="Improve your LinkedIn profile, headline, about section, and recruiter visibility."
    >
      <FirstUseTutorial moduleKey="linkedin_optimizer" />
    </ModulePageLayout>
  )
}