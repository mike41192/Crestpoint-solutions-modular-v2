"use client"

import { useEffect, useState } from "react"
import type {
  ResumeBuilderFormData,
  ResumeTemplateType,
} from "@/modules/resume-builder"
import {
  getSelectedResumeTemplate,
  loadResumeDraftLocally,
  setSelectedResumeTemplate,
  starterResumeData,
} from "@/modules/resume-builder"
import {
  ClassicTemplate,
  ExecutiveTemplate,
  ModernTemplate,
  TemplateSelector,
} from "@/components/resume/templates"

export function ResumeExportPreview() {
  const [data, setData] =
    useState<ResumeBuilderFormData>(starterResumeData)

  const [template, setTemplate] =
    useState<ResumeTemplateType>("classic")

  useEffect(() => {
    try {
      const savedDraft = loadResumeDraftLocally()
      const savedTemplate = getSelectedResumeTemplate()

      if (savedDraft) {
        setData(savedDraft)
      }

      setTemplate(savedTemplate)
    } catch {
      setData(starterResumeData)
      setTemplate("classic")
    }
  }, [])

  function changeTemplate(nextTemplate: ResumeTemplateType) {
    setTemplate(nextTemplate)
    setSelectedResumeTemplate(nextTemplate)
  }

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <div
        className="export-template-toolbar"
        style={{
          maxWidth: "850px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
          padding: "12px 14px",
          border: "1px solid #e2e8f0",
          borderRadius: "14px",
          background: "#ffffff",
          boxShadow: "0 8px 24px rgba(15,23,42,.06)",
        }}
      >
        <div>
          <strong style={{ color: "#0f172a" }}>
            Export Template
          </strong>

          <p
            style={{
              marginTop: "3px",
              color: "#64748b",
              fontSize: "13px",
            }}
          >
            Select the layout used for PDF export.
          </p>
        </div>

        <TemplateSelector value={template} onChange={changeTemplate} />
      </div>

      <section
        className="resume-export-document"
        style={{
          maxWidth: "850px",
          margin: "0 auto",
          background: "#ffffff",
          boxShadow: "0 18px 50px rgba(15,23,42,.12)",
        }}
      >
        {template === "classic" && <ClassicTemplate data={data} />}

        {template === "modern" && <ModernTemplate data={data} />}

        {template === "executive" && <ExecutiveTemplate data={data} />}

        <style>{`
          .resume-export-document article {
            box-shadow: none !important;
          }

          .resume-export-document h1,
          .resume-export-document h2,
          .resume-export-document h3 {
            break-after: avoid;
            page-break-after: avoid;
          }

          .resume-export-document li {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          @media print {
            @page {
              size: Letter;
              margin: 0.5in;
            }

            html,
            body {
              background: #ffffff !important;
            }

            .export-template-toolbar {
              display: none !important;
            }

            .resume-export-document {
              max-width: none !important;
              width: 100% !important;
              margin: 0 !important;
              box-shadow: none !important;
            }

            .resume-export-document article {
              border: none !important;
              border-radius: 0 !important;
              padding: 0 !important;
            }

            .resume-export-document header {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            .resume-export-document li {
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }
        `}</style>
      </section>
    </div>
  )
}
