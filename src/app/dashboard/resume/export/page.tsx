import { ResumeExportPreview } from "@/components/resume/export/ResumeExportPreview"
import { ResumePrintActions } from "@/components/resume/export/ResumePrintActions"

export default function ResumeExportPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: "24px",
      }}
    >
      <div
        className="export-toolbar"
        style={{
          maxWidth: "900px",
          margin: "0 auto 18px",
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 900 }}>
            Resume Export
          </h1>

          <p style={{ marginTop: "4px", color: "#64748b" }}>
            Review the final resume, then save as PDF.
          </p>
        </div>

        <ResumePrintActions />
      </div>

      <ResumeExportPreview />

      <style>{`
        @media print {
          body {
            background: #ffffff !important;
          }

          .export-toolbar {
            display: none !important;
          }

          main {
            padding: 0 !important;
            background: #ffffff !important;
          }
        }
      `}</style>
    </main>
  )
}