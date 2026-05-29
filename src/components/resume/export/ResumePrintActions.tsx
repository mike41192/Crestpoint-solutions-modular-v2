"use client"

import { useState } from "react"
import {
  getSelectedResumeTemplate,
  loadResumeDraftLocally,
} from "@/modules/resume-builder"
import { openPrintDialog } from "@/modules/resume-builder/export"

export function ResumePrintActions() {
  const [downloadingDocx, setDownloadingDocx] = useState(false)
  const [message, setMessage] = useState("")

  async function downloadDocx() {
    setDownloadingDocx(true)
    setMessage("Preparing DOCX export...")

    try {
      const resumeData = loadResumeDraftLocally()
      const selectedTemplate = getSelectedResumeTemplate()

      if (!resumeData) {
        setMessage("No local resume draft found. Save or load a resume first.")
        setDownloadingDocx(false)
        return
      }

      const response = await fetch("/api/resume/export-docx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeData,
          selectedTemplate,
        }),
      })

      if (!response.ok) {
        setMessage("DOCX export failed.")
        setDownloadingDocx(false)
        return
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")

      link.href = downloadUrl
      link.download = "resume.docx"
      document.body.appendChild(link)
      link.click()
      link.remove()

      window.URL.revokeObjectURL(downloadUrl)

      setMessage("DOCX downloaded.")
    } catch {
      setMessage("DOCX export request failed.")
    }

    setDownloadingDocx(false)
  }

  return (
    <div
      style={{
        display: "grid",
        gap: "8px",
      }}
    >
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
          onClick={downloadDocx}
          disabled={downloadingDocx}
          style={{
            border: "1px solid #bfdbfe",
            borderRadius: "12px",
            padding: "12px 18px",
            background: downloadingDocx ? "#dbeafe" : "#eff6ff",
            color: "#1d4ed8",
            fontWeight: 800,
            cursor: downloadingDocx ? "not-allowed" : "pointer",
          }}
        >
          {downloadingDocx ? "Preparing DOCX..." : "Download DOCX"}
        </button>
      </div>

      {message && (
        <p
          style={{
            color: "#475569",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          {message}
        </p>
      )}
    </div>
  )
}
