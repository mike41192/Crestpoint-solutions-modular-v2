"use client"

import { openPrintDialog } from "@/modules/resume-builder/export"

export function ResumePrintActions() {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      <button
        type="button"
        onClick={openPrintDialog}
        style={{
          border: 0,
          borderRadius: "12px",
          padding: "12px 18px",
          background: "#2563eb",
          color: "#ffffff",
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        Save as PDF
      </button>

      <button
        type="button"
        disabled
        style={{
          border: "1px solid #cbd5e1",
          borderRadius: "12px",
          padding: "12px 18px",
          background: "#ffffff",
          color: "#64748b",
          fontWeight: 800,
        }}
      >
        DOCX Export (Phase 149)
      </button>
    </div>
  )
}