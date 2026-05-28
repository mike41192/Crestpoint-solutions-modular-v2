"use client"

import { useState } from "react"
import type {
  ResumeBuilderFormData,
  ResumeTemplateType,
} from "@/modules/resume-builder"
import {
  ClassicTemplate,
  ExecutiveTemplate,
  ModernTemplate,
  TemplateSelector,
} from "@/components/resume/templates"

type ResumeEditorPreviewProps = {
  data: ResumeBuilderFormData
}

export function ResumeEditorPreview({ data }: ResumeEditorPreviewProps) {
  const [template, setTemplate] = useState<ResumeTemplateType>("classic")

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: "14px",
          padding: "14px",
          background: "#f8fafc",
        }}
      >
        <h3 style={{ fontSize: "18px", fontWeight: 800 }}>
          Resume Template
        </h3>

        <p style={{ marginTop: "6px", color: "#64748b", lineHeight: 1.5 }}>
          Choose how your resume preview should look. This prepares the resume
          for future PDF and DOCX export.
        </p>

        <div style={{ marginTop: "12px" }}>
          <TemplateSelector value={template} onChange={setTemplate} />
        </div>
      </div>

      {template === "classic" && <ClassicTemplate data={data} />}

      {template === "modern" && <ModernTemplate data={data} />}

      {template === "executive" && <ExecutiveTemplate data={data} />}
    </div>
  )
}