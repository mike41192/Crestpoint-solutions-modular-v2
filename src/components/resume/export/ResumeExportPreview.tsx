"use client"

import { useEffect, useState } from "react"
import { LayoutTemplate } from "lucide-react"
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
  const [data, setData] = useState<ResumeBuilderFormData>(starterResumeData)
  const [template, setTemplate] = useState<ResumeTemplateType>("classic")

  useEffect(() => {
    try {
      const savedDraft = loadResumeDraftLocally()
      const savedTemplate = getSelectedResumeTemplate()

      if (savedDraft) setData(savedDraft)

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
    <div className="grid gap-5">
      <div className="export-template-toolbar mx-auto flex w-full max-w-[980px] flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="rounded-2xl bg-blue-50 p-2 text-blue-700">
            <LayoutTemplate size={20} />
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-950">
              Export Template
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Select the layout used for PDF export.
            </p>
          </div>
        </div>

        <div className="w-full lg:max-w-[460px]">
          <TemplateSelector value={template} onChange={changeTemplate} />
        </div>
      </div>

      <section className="resume-export-frame mx-auto w-full max-w-[980px] overflow-x-auto rounded-[28px] border border-slate-200 bg-slate-200 p-3 shadow-sm sm:p-5">
        <div className="resume-export-document mx-auto w-[8.5in] max-w-full bg-white shadow-2xl shadow-slate-400/30">
          {template === "classic" && <ClassicTemplate data={data} />}
          {template === "modern" && <ModernTemplate data={data} />}
          {template === "executive" && <ExecutiveTemplate data={data} />}
        </div>
      </section>

      <style>{`
        .resume-export-document,
        .resume-export-document * {
          box-sizing: border-box;
        }

        .resume-export-document article {
          width: 100% !important;
          min-height: 11in;
          box-shadow: none !important;
        }

        .resume-export-document p,
        .resume-export-document li,
        .resume-export-document span,
        .resume-export-document strong {
          overflow-wrap: anywhere;
          word-break: normal;
        }

        @media print {
          @page {
            size: Letter;
            margin: 0.4in;
          }

          html,
          body {
            background: #ffffff !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          .export-template-toolbar,
          .export-toolbar {
            display: none !important;
          }

          .resume-export-frame {
            display: block !important;
            overflow: visible !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: none !important;
            width: 100% !important;
          }

          .resume-export-document {
            display: block !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            background: #ffffff !important;
          }

          .resume-export-document article {
            display: block !important;
            width: 100% !important;
            min-height: auto !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }

          /*
            CRITICAL:
            Reset all forced page-break avoidance from template inline styles.
            These were causing summary/header sections to be pushed onto their own pages.
          */
          .resume-export-document header,
          .resume-export-document section,
          .resume-export-document main,
          .resume-export-document aside,
          .resume-export-document div,
          .resume-export-document article {
            break-inside: auto !important;
            page-break-inside: auto !important;
            break-before: auto !important;
            page-break-before: auto !important;
            break-after: auto !important;
            page-break-after: auto !important;
          }

          /*
            Keep only headings attached to the next line.
            Do NOT keep whole sections together.
          */
          .resume-export-document h1,
          .resume-export-document h2,
          .resume-export-document h3 {
            break-after: avoid !important;
            page-break-after: avoid !important;
          }

          /*
            Keep individual bullets from splitting, but allow the overall section to flow.
          */
          .resume-export-document li {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          /*
            Modern template grid can fragment badly in print.
            Force stacked print flow so the header/sidebar do not get isolated.
          */
          .resume-export-document article > div {
            display: block !important;
          }

          .resume-export-document aside {
            border-right: none !important;
            border-bottom: 1px solid #e2e8f0 !important;
          }

          a {
            color: inherit !important;
            text-decoration: none !important;
          }
        }
      `}</style>
    </div>
  )
}
