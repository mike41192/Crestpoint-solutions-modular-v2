import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"

export default function UserSettingsPage() {
  return (
    <ModulePageLayout
      title="Account Settings"
      description="Manage your profile, preferences, membership, and account access."
    >
      <FirstUseTutorial moduleKey="admin_tools" />
    </ModulePageLayout>
  )
}