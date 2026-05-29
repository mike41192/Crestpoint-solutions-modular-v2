import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"
import { ResumeStarterForm } from "@/components/resume/ResumeStarterForm"
import { getResumeBuilderPreviewData } from "@/modules/resume-builder"

export default function ResumeDashboardPage() {
  const resumes = getResumeBuilderPreviewData()
  const primaryResume = resumes[0]

  return (
    <ModulePageLayout
      title="Resume Builder"
      description="Build, import, optimize, score, and export professional resumes."
    >
      <div className="mx-auto w-full max-w-[1500px] space-y-6 px-3 sm:px-5 lg:px-6">
        <FirstUseTutorial moduleKey="resume_builder" />

        {primaryResume?.data ? (
          <ResumeStarterForm data={primaryResume.data} />
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-black text-slate-950">
              No resume loaded
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Create or import a resume to begin using the builder.
            </p>
          </div>
        )}
      </div>
    </ModulePageLayout>
  )
}
