"use client"

import { FileText } from "lucide-react"
import { RichTextEditor } from "@/components/resume/editor/RichTextEditor"

type SummarySectionProps = {
  summary: string
  onChange: (value: string) => void
}

export function SummarySection({ summary, onChange }: SummarySectionProps) {
  return (
    <section className="w-full min-w-0 max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex min-w-0 items-start gap-3 border-b border-slate-100 pb-4">
        <div className="shrink-0 rounded-2xl bg-blue-50 p-2 text-blue-700">
          <FileText size={18} />
        </div>

        <div className="min-w-0">
          <h3 className="break-words text-lg font-black text-slate-950">
            Professional Summary
          </h3>
          <p className="mt-1 break-words text-sm leading-6 text-slate-500">
            Write a concise recruiter-friendly summary that highlights your
            strongest experience.
          </p>
        </div>
      </div>

      <div className="w-full min-w-0 max-w-full overflow-hidden">
        <RichTextEditor
          value={summary}
          minHeight="150px"
          placeholder="Example: Operations and maintenance professional with experience improving reliability, supporting production teams, and reducing downtime..."
          onChange={onChange}
        />
      </div>

      <div className="mt-3 text-xs font-bold leading-5 text-slate-500">
        Recommended length: 3–5 sentences
      </div>
    </section>
  )
}
