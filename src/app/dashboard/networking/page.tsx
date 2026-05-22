import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"

export default function NetworkingDashboardPage() {
  return (
    <ModulePageLayout
      title="Networking Assistant"
      description="Create recruiter messages, referral requests, follow-ups, and professional outreach."
    >
      <FirstUseTutorial moduleKey="networking_outreach" />
    </ModulePageLayout>
  )
}
