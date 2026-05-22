import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"

export default function ATSDashboardPage() {
  return (
    <main style={{ padding: "32px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 700 }}>ATS Scoring</h1>

      <p style={{ marginTop: "8px", color: "#64748b" }}>
        Score your resume against job descriptions and improve keyword alignment.
      </p>

      <FirstUseTutorial moduleKey="ats_scoring" />
    </main>
  )
}
