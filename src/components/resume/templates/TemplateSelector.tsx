"use client"

import type { ResumeTemplateType } from "@/modules/resume-builder"

type Props = {
  value: ResumeTemplateType
  onChange: (template: ResumeTemplateType) => void
}

export function TemplateSelector({
  value,
  onChange,
}: Props) {
  const templates: ResumeTemplateType[] = [
    "classic",
    "modern",
    "executive",
    "ats",
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {templates.map((template) => {
        const selected = value === template

        return (
          <button
            key={template}
            type="button"
            onClick={() => onChange(template)}
            className={`
              rounded-xl
              border
              px-4
              py-3
              text-left
              transition-all
              ${
                selected
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-300 bg-white hover:border-slate-400"
              }
            `}
          >
            <div className="font-extrabold capitalize text-slate-900">
              {template}
            </div>

            <div className="mt-1 text-xs text-slate-500">
              {template === "classic" &&
                "ATS-friendly professional layout"}

              {template === "modern" &&
                "Modern design with stronger visual hierarchy"}

              {template === "executive" &&
                "Leadership-focused executive presentation"}

              {template === "ats" &&
                "Optimized for Applicant Tracking Systems (ATS)"}
            </div>
          </button>
        )
      })}
    </div>
  )
}
