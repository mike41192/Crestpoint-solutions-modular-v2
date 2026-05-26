import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { SectionCard } from "@/components/layout/SectionCard"
import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"
import { ResumeEditorPreview } from "@/components/resume/ResumeEditorPreview"
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
      description="Build, import, optimize, and export professional resumes."
    >
      <FirstUseTutorial moduleKey="resume_builder" />

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          marginTop: "24px",
        }}
      >
        <SectionCard>
          <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
            Resume Workspace
          </h2>

          <p style={{ marginTop: "8px", color: "#64748b", lineHeight: 1.5 }}>
            Start with your main resume, then expand into AI optimization,
            importing, formatting, and exporting.
          </p>

          <div style={{ marginTop: "16px" }}>
            <strong>{primaryResume.title}</strong>

            <p style={{ color: "#64748b", marginTop: "4px" }}>
              Status: {primaryResume.status}
            </p>
          </div>
        </SectionCard>

        <SectionCard>
          <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
            Resume Sections
          </h2>

          <ul style={{ marginTop: "12px", paddingLeft: "20px" }}>
            {resumeBuilderSections.map((section) => (
              <li
                key={section}
                style={{ marginBottom: "8px", color: "#475569" }}
              >
                {section}
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard>
          <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
            Resume Data Preview
          </h2>

          {primaryResume.data && (
            <div style={{ marginTop: "16px" }}>
              <ResumeEditorPreview data={primaryResume.data} />
            </div>
          )}
        </SectionCard>

        <SectionCard>
          <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
            Next Build Steps
          </h2>

          <p style={{ marginTop: "8px", color: "#64748b", lineHeight: 1.5 }}>
            Upcoming phases will add editable inputs, import parsing, AI
            optimization, ATS alignment, and export controls.
          </p>
        </SectionCard>
      </section>
    </ModulePageLayout>
  )
}