"use client"

import { FileText } from "lucide-react"
import { RichTextEditor } from "@/components/resume/editor/RichTextEditor"

type SummarySectionProps = {
  summary: string
  onChange: (value: string) => void
}

export function SummarySection({
  summary,
  onChange,
}: SummarySectionProps) {
  const characterCount = summary?.replace(/<[^>]*>/g, "").length || 0

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-3 border-b border-slate-100 pb-4">
        <div className="rounded-2xl bg-blue-50 p-2 text-blue-700">
          <FileText size={18} />
        </div>

        <div className="min-w-0">
          <h3 className="text-lg font-black text-slate-950">
            Professional Summary
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Write a concise recruiter-friendly summary that highlights your strongest experience.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
        <RichTextEditor
          value={summary}
          minHeight="160px"
          placeholder="Example: Operations and maintenance professional with experience improving reliability, supporting production teams, and reducing downtime through preventive maintenance, troubleshooting, and process improvement."
          onChange={onChange}
        />
      </div>

      <div className="mt-3 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Recommended length:{" "}
          <span className="font-bold text-slate-700">3–5 sentences</span>
        </p>

        <p
          className={
            characterCount > 900
              ? "font-bold text-amber-700"
              : "font-semibold text-slate-500"
          }
        >
          {characterCount} characters
        </p>
      </div>
    </section>
  )
}
