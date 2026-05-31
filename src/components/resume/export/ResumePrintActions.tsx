"use client"

import { useState } from "react"
import { Download, Loader2, Printer } from "lucide-react"
import { motion } from "framer-motion"
import {
  getSelectedResumeTemplate,
  loadResumeDraftLocally,
  starterResumeData,
} from "@/modules/resume-builder"

export function ResumePrintActions() {
  const [downloading, setDownloading] = useState(false)

  function printResume() {
    window.print()
  }

  async function downloadPdf() {
    setDownloading(true)

    try {
      const data = loadResumeDraftLocally() || starterResumeData
      const template = getSelectedResumeTemplate()

      const response = await fetch("/api/resume/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
          template,
        }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.message || "PDF export failed.")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")

      link.href = url
      link.download = `crestpoint-resume-${template}.pdf`

      document.body.appendChild(link)
      link.click()
      link.remove()

      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert(String(error))
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <motion.button
        type="button"
        onClick={downloadPdf}
        disabled={downloading}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {downloading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <Download size={16} />
        )}

        {downloading ? "Generating..." : "Download PDF"}
      </motion.button>

      <motion.button
        type="button"
        onClick={printResume}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
      >
        <Printer size={16} />
        Print
      </motion.button>
    </div>
  )
}
