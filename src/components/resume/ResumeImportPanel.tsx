"use client"

import { useState } from "react"
import type { ResumeBuilderFormData } from "@/modules/resume-builder"

type ResumeImportPanelProps = {
  onApplyImportedResume: (data: ResumeBuilderFormData) => void
}

export function ResumeImportPanel({
  onApplyImportedResume,
}: ResumeImportPanelProps) {
  const [fileName, setFileName] = useState("")
  const [message, setMessage] = useState("")
  const [preview, setPreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [detectedSections, setDetectedSections] = useState<string[]>([])
  const [parsedData, setParsedData] = useState<ResumeBuilderFormData | null>(
    null
  )

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setFileName(file.name)
    setMessage("")
    setPreview("")
    setDetectedSections([])
    setParsedData(null)
  }

  async function uploadResume(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const input = form.elements.namedItem("resumeFile") as HTMLInputElement
    const file = input.files?.[0]

    if (!file) {
      setMessage("Choose a resume file before importing.")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    setLoading(true)
    setMessage("")
    setPreview("")
    setDetectedSections([])
    setParsedData(null)

    try {
      const response = await fetch("/api/resume/import", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      setMessage(result.message || "Import request completed.")
      setPreview(result.preview || "")
      setDetectedSections(result.detectedSections || [])
      setParsedData(result.parsedData || null)
    } catch {
      setMessage("Resume import request failed.")
    } finally {
      setLoading(false)
    }
  }

  function applyImportedResume() {
    if (!parsedData) {
      setMessage("No parsed resume data is available to apply.")
      return
    }

    onApplyImportedResume(parsedData)
    setMessage("Imported resume data applied to the editor.")
  }

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "14px",
        background: "#f8fafc",
      }}
    >
      <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Resume Import</h3>

      <p style={{ marginTop: "6px", color: "#64748b", lineHeight: 1.5 }}>
        Upload a plain text resume to import structured resume fields. PDF and
        DOCX parsing will be added after the text import flow is verified.
      </p>

      <form
        onSubmit={uploadResume}
        style={{ display: "grid", gap: "12px", marginTop: "14px" }}
      >
        <input
          name="resumeFile"
          type="file"
          accept=".txt,.pdf,.doc,.docx"
          onChange={handleFileChange}
        />

        {fileName && (
          <p style={{ color: "#334155" }}>
            Selected file: <strong>{fileName}</strong>
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            border: "0",
            borderRadius: "12px",
            padding: "12px 16px",
            background: loading ? "#94a3b8" : "#2563eb",
            color: "#ffffff",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            width: "fit-content",
          }}
        >
          {loading ? "Importing..." : "Import Resume"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "12px", color: "#334155" }}>{message}</p>
      )}

      {detectedSections.length > 0 && (
        <div
          style={{
            marginTop: "12px",
            border: "1px solid #bbf7d0",
            borderRadius: "10px",
            padding: "12px",
            background: "#f0fdf4",
            color: "#166534",
          }}
        >
          <strong>Detected Sections</strong>

          <p style={{ marginTop: "6px" }}>{detectedSections.join(", ")}</p>
        </div>
      )}

      {parsedData && (
        <div
          style={{
            marginTop: "12px",
            border: "1px solid #bfdbfe",
            borderRadius: "10px",
            padding: "12px",
            background: "#eff6ff",
          }}
        >
          <strong>Structured Import Ready</strong>

          <p style={{ marginTop: "6px", color: "#334155" }}>
            Parsed resume fields are ready to apply to the editor.
          </p>

          <button
            type="button"
            onClick={applyImportedResume}
            style={{
              marginTop: "10px",
              border: "0",
              borderRadius: "12px",
              padding: "10px 14px",
              background: "#2563eb",
              color: "#ffffff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Apply Imported Resume
          </button>
        </div>
      )}

      {preview && (
        <div
          style={{
            marginTop: "12px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "12px",
            background: "#ffffff",
          }}
        >
          <strong>Import Preview</strong>

          <pre
            style={{
              marginTop: "8px",
              whiteSpace: "pre-wrap",
              color: "#475569",
              fontFamily: "inherit",
            }}
          >
            {preview}
          </pre>
        </div>
      )}
    </div>
  )
}