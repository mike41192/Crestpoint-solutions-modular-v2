import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { ResumeExportOptions } from "@/components/resume/ResumeExportOptions"
import { ResumeExportPreview } from "@/components/resume/ResumeExportPreview"
import { ResumePrintActions } from "@/components/resume/ResumePrintActions"
import { getResumeBuilderPreviewData } from "@/modules/resume-builder"

export default function ResumeExportPage() {
  const resumes = getResumeBuilderPreviewData()
  const primaryResume = resumes[0]

  return (
    <ModulePageLayout
      title="Resume Export Preview"
      description="Preview a clean print-friendly resume layout before direct PDF export is fully connected."
    >
      <ResumeExportOptions />

      <ResumePrintActions />

      {primaryResume.data && <ResumeExportPreview data={primaryResume.data} />}
    </ModulePageLayout>
  )
}