import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { SectionCard } from "@/components/layout/SectionCard"
import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"
import { ResumeStarterForm } from "@/components/resume/ResumeStarterForm"
import {
  getResumeBuilderPreviewData,
  resumeBuilderSections,
} from "@/modules/resume-builder"

export default function ResumeDashboardPage() {
  const resumes = getResumeBuilderPreviewData()
  const primaryResume = resumes[0]

  return (
    <ModulePageLayout
      title="Resume Builder"
      description="Build, import, optimize, score, and export professional resumes."
    >
      <div
        style={{
          display: "grid",
          gap: "18px",
          marginTop: "20px",
        }}
      >
        <FirstUseTutorial moduleKey="resume_builder" />

        <SectionCard>
          {primaryResume.data && <ResumeStarterForm data={primaryResume.data} />}
        </SectionCard>

        <SectionCard>
          <h2 style={{ fontSize: "20px", fontWeight: 800 }}>
            Resume Builder Includes
          </h2>

          <p style={{ marginTop: "6px", color: "#64748b", lineHeight: 1.5 }}>
            This workspace is modular. Each section supports future AI, export,
            scoring, and account-based saving upgrades.
          </p>

          <ul style={{ marginTop: "14px", paddingLeft: "20px" }}>
            {resumeBuilderSections.map((section) => (
              <li
                key={section}
                style={{
                  marginBottom: "8px",
                  color: "#475569",
                }}
              >
                {section}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </ModulePageLayout>
  )
}
