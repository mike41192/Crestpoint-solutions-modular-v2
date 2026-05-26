"use client"

import { useState } from "react"
import { ResumeOptimizationResults } from "@/components/resume/ResumeOptimizationResults"
import type { ResumeBuilderFormData } from "@/modules/resume-builder"

type ResumeOptimizeActionsProps = {
  data: ResumeBuilderFormData
}

export function ResumeOptimizeActions({
  data,
}: ResumeOptimizeActionsProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [results, setResults] = useState<string[]>([])

  async function optimizeResume() {
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/resume/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume: data,
        }),
      })

      const result = await response.json()

      setMessage(result.message || "Optimization request completed.")

      setResults([
        "Use stronger action verbs in work experience bullet points.",
        "Add more measurable metrics and achievements.",
        "Expand your professional summary for stronger ATS matching.",
        "Increase skills alignment with your target job title.",
      ])
    } catch {
      setMessage("Resume optimization request failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        border: "1px solid #dbeafe",
        borderRadius: "12px",
        padding: "14px",
        background: "#eff6ff",
        display: "grid",
        gap: "16px",
      }}
    >
      <div>
        <h3 style={{ fontSize: "18px", fontWeight: 700 }}>
          AI Resume Optimization
        </h3>

        <p style={{ marginTop: "6px", color: "#475569", lineHeight: 1.5 }}>
          Send this resume draft to the optimization pipeline. OpenAI
          connection will be enabled in a later phase.
        </p>

        <button
          type="button"
          onClick={optimizeResume}
          disabled={loading}
          style={{
            marginTop: "12px",
            border: "0",
            borderRadius: "12px",
            padding: "12px 16px",
            background: loading ? "#94a3b8" : "#2563eb",
            color: "#ffffff",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Optimizing..." : "Run AI Optimization"}
        </button>

        {message && (
          <p style={{ marginTop: "10px", color: "#334155" }}>
            {message}
          </p>
        )}
      </div>

      <ResumeOptimizationResults results={results} />
    </div>
  )
}