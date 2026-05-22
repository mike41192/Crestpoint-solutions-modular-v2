import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"

export default function InterviewDashboardPage() {
  return (
    <main style={{ padding: "32px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 700 }}>AI Interviewer</h1>

      <p style={{ marginTop: "8px", color: "#64748b" }}>
        Practice interviews with AI-generated questions and feedback.
      </p>

      <FirstUseTutorial moduleKey="ai_interviewer" />
    </main>
  )
}