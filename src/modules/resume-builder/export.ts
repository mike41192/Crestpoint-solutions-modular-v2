export type ResumeExportFormat = "print" | "pdf"

export type ResumeExportOption = {
  label: string
  format: ResumeExportFormat
  enabled: boolean
  description: string
}

export const resumeExportOptions: ResumeExportOption[] = [
  {
    label: "Browser Print",
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
      "Direct PDF export is planned for a future phase after print layout verification.",
  },
]