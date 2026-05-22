import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"

export default function BillingDashboardPage() {
  return (
    <ModulePageLayout
      title="Billing"
      description="Review your membership, billing status, plan access, and upgrade options."
    >
      <FirstUseTutorial moduleKey="billing_manager" />
    </ModulePageLayout>
  )
}