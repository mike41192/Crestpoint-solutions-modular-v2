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
  ]

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      {templates.map((template) => (
        <button
          key={template}
          type="button"
          onClick={() => onChange(template)}
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            border:
              value === template
                ? "2px solid #2563eb"
                : "1px solid #cbd5e1",
            background:
              value === template
                ? "#eff6ff"
                : "#ffffff",
            fontWeight: 700,
            cursor: "pointer",
            textTransform: "capitalize",
          }}
        >
          {template}
        </button>
      ))}
    </div>
  )
}