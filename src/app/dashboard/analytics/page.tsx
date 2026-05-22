import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"

export default function DashboardAnalyticsPage() {
  return (
    <ModulePageLayout
      title="Career Analytics"
      description="View readiness scores, activity insights, application progress, and career growth metrics."
    >
      <FirstUseTutorial moduleKey="analytics_dashboard" />
    </ModulePageLayout>
  )
}