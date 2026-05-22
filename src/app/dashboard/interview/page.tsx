import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"

export default function InterviewDashboardPage() {
  return (
    <ModulePageLayout
      title="AI Interviewer"
      description="Practice interviews with AI-generated questions and feedback."
    >
      <FirstUseTutorial moduleKey="ai_interviewer" />
    </ModulePageLayout>
  )
}