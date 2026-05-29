import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { SectionCard } from "@/components/layout/SectionCard"
import { ResumeLibrary } from "@/components/resume/library/ResumeLibrary"

export default function ResumeLibraryPage() {
  return (
    <ModulePageLayout
      title="Resume Library"
      description="Manage saved resumes, job-specific copies, and future version history."
    >
      <div style={{ marginTop: "20px" }}>
        <SectionCard>
          <ResumeLibrary />
        </SectionCard>
      </div>
    </ModulePageLayout>
  )
}