"use client"

import { useState } from "react"
import { CheckCircle2, FileUp, Loader2, Sparkles, Upload } from "lucide-react"
import type { ResumeBuilderFormData } from "@/modules/resume-builder"

type ResumeImportPanelProps = {
  onApplyImportedResume: (data: ResumeBuilderFormData) => void
}

export function ResumeImportPanel({ onApplyImportedResume }: ResumeImportPanelProps) {
  const [fileName, setFileName] = useState("")
  const [message, setMessage] = useState("")
  const [preview, setPreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [detectedSections, setDetectedSections] = useState<string[]>([])
  const [parsedData, setParsedData] = useState<ResumeBuilderFormData | null>(null)

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

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
    <section className="w-full min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex items-start gap-3 border-b border-slate-100 pb-4">
        <div className="rounded-2xl bg-blue-50 p-2 text-blue-700">
          <FileUp size={18} />
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-950">Resume Import</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Upload TXT, DOCX, text-based PDF, or image scans and convert them into structured builder fields.
          </p>
        </div>
      </div>

      <form onSubmit={uploadResume} className="grid gap-4">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-blue-300 hover:bg-blue-50">
          <Upload className="text-blue-600" size={26} />

          <span className="mt-3 text-sm font-black text-slate-900">
            Choose resume file
          </span>

          <span className="mt-1 text-xs font-semibold text-slate-500">
            Supports .txt, .doc, .docx, .pdf, .png, .jpg, .jpeg, and .webp
          </span>

          <input
            name="resumeFile"
            type="file"
            accept=".txt,.pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
            onChange={handleFileChange}
            className="sr-only"
          />
        </label>

        {fileName && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3 text-sm font-bold text-blue-800">
            Selected file: {fileName}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-fit"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Importing...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Import Resume
            </>
          )}
        </button>
      </form>

      {message && (
        <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold leading-6 text-slate-700">
          {message}
        </p>
      )}

      {detectedSections.length > 0 && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <strong className="flex items-center gap-2 font-black">
            <CheckCircle2 size={16} />
            Detected Sections
          </strong>
          <p className="mt-2 font-semibold">{detectedSections.join(", ")}</p>
        </div>
      )}

      {parsedData && (
        <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <strong className="font-black text-blue-950">Structured Import Ready</strong>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Parsed resume fields are ready to apply to the editor.
          </p>

          <button
            type="button"
            onClick={applyImportedResume}
            className="mt-3 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-700"
          >
            Apply Imported Resume
          </button>
        </div>
      )}

      {preview && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <strong className="font-black text-slate-950">Import Preview</strong>

          <pre className="mt-3 max-h-[320px] overflow-auto whitespace-pre-wrap rounded-2xl bg-white p-4 text-sm leading-6 text-slate-600">
            {preview}
          </pre>
        </div>
      )}
    </section>
  )
}
