import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { SectionCard } from "@/components/layout/SectionCard"
import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"

const academySections = [
  {
    title: "Interview Basics",
    description:
      "Learn the foundations of successful interviewing and employer expectations.",
  },
  {
    title: "STAR Method",
    description:
      "Practice answering behavioral questions using the STAR framework.",
  },
  {
    title: "Confidence Training",
    description:
      "Improve communication, body language, and confidence during interviews.",
  },
  {
    title: "AI Interview Practice",
    description:
      "Practice mock interviews and receive AI-powered feedback and coaching.",
  },
]

export default function InterviewAcademyPage() {
  return (
    <ModulePageLayout
      title="Interview Academy"
      description="Learn how to prepare for interviews, improve confidence, answer difficult questions, and increase your chances of getting hired."
    >
      <FirstUseTutorial moduleKey="interview_academy" />

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          marginTop: "24px",
        }}
      >
        {academySections.map((section) => (
          <SectionCard key={section.title}>
            <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
              {section.title}
            </h2>

            <p style={{ marginTop: "8px", color: "#64748b" }}>
              {section.description}
            </p>
          </SectionCard>
        ))}
      </section>
    </ModulePageLayout>
  )
}