import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { SectionCard } from "@/components/layout/SectionCard"
import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"
import { getResumeBuilderPreviewData } from "@/modules/resume-builder"
import { resumeBuilderSections } from "@/modules/resume-builder"

export default function ResumeDashboardPage() {
  const resumes = getResumeBuilderPreviewData()

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
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
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
            {resumes.map((resume) => (
              <div key={resume.id}>
                <strong>{resume.title}</strong>
                <p style={{ color: "#64748b", marginTop: "4px" }}>
                  Status: {resume.status}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard>
          <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
            Resume Sections
          </h2>

          <ul style={{ marginTop: "12px", paddingLeft: "20px" }}>
            {resumeBuilderSections.map((section) => (
              <li key={section} style={{ marginBottom: "8px", color: "#475569" }}>
                {section}
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard>
          <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
            Next Build Steps
          </h2>

          <p style={{ marginTop: "8px", color: "#64748b", lineHeight: 1.5 }}>
            Upcoming phases will add editable resume fields, import parsing,
            AI optimization, ATS alignment, and export controls.
          </p>
        </SectionCard>
      </section>
    </ModulePageLayout>
  )
}