"use client"

import { useEffect, useState } from "react"
import type {
  ResumeBuilderFormData,
  ResumeTemplateType,
} from "@/modules/resume-builder"
import {
  getSelectedResumeTemplate,
  setSelectedResumeTemplate,
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
  const [template, setTemplate] =
    useState<ResumeTemplateType>("classic")

  useEffect(() => {
    setTemplate(getSelectedResumeTemplate())
  }, [])

  function changeTemplate(nextTemplate: ResumeTemplateType) {
    setTemplate(nextTemplate)
    setSelectedResumeTemplate(nextTemplate)
  }

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
          Choose how your resume preview should look. This same template will
          be used on the export page.
        </p>

        <div style={{ marginTop: "12px" }}>
          <TemplateSelector value={template} onChange={changeTemplate} />
        </div>
      </div>

      {template === "classic" && <ClassicTemplate data={data} />}

      {template === "modern" && <ModernTemplate data={data} />}

      {template === "executive" && <ExecutiveTemplate data={data} />}
    </div>
  )
}
