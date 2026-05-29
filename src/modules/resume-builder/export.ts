export type ResumeExportFormat = "print" | "pdf" | "docx"

export type ResumeExportOption = {
  label: string
  format: ResumeExportFormat
  enabled: boolean
  description: string
}

export const resumeExportOptions: ResumeExportOption[] = [
  {
    label: "Browser Print / Save as PDF",
    format: "print",
    enabled: true,
    description:
      "Use the browser print dialog to print or save the resume as a PDF.",
  },
  {
    label: "Direct PDF Export",
    format: "pdf",
    enabled: false,
    description:
      "Direct PDF generation will be connected after the print layout is verified.",
  },
  {
    label: "DOCX Export",
    format: "docx",
    enabled: false,
    description:
      "DOCX export is planned for the next export phase.",
  },
]

export function openPrintDialog() {
  if (typeof window === "undefined") {
    return
  }

  window.print()
}