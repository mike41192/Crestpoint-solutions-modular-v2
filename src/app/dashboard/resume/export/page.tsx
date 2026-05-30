import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"
import { ResumeExportPreview } from "@/components/resume/export/ResumeExportPreview"
import { ResumePrintActions } from "@/components/resume/export/ResumePrintActions"

export default function ResumeExportPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6">
      <div className="export-toolbar mx-auto mb-5 flex max-w-[980px] flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="rounded-2xl bg-blue-50 p-2 text-blue-700">
            <FileText size={20} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
              Resume Export
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
              Final Resume Preview
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Review the final resume layout, then print or save as PDF.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/dashboard/resume"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
          >
            <ArrowLeft size={16} />
            Back to Builder
          </Link>

          <ResumePrintActions />
        </div>
      </div>

      <section className="mx-auto max-w-[980px]">
        <ResumeExportPreview />
      </section>

      <style>{`
        @page {
          size: letter;
          margin: 0.35in;
        }

        @media print {
          html,
          body {
            background: #ffffff !important;
          }

          .export-toolbar {
            display: none !important;
          }

          main {
            padding: 0 !important;
            background: #ffffff !important;
          }

          a {
            color: inherit !important;
            text-decoration: none !important;
          }
        }
      `}</style>
    </main>
  )
}
