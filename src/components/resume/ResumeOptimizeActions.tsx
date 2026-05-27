"use client"

import { useState } from "react"
import { ResumeOptimizationResults } from "@/components/resume/ResumeOptimizationResults"
import type {
  ResumeBuilderFormData,
  ResumeOptimizationSuggestion,
} from "@/modules/resume-builder"

type ResumeOptimizeActionsProps = {
  data: ResumeBuilderFormData
  onApplySuggestion: (suggestion: ResumeOptimizationSuggestion) => void
}

export function ResumeOptimizeActions({
  data,
  onApplySuggestion,
}: ResumeOptimizeActionsProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [results, setResults] = useState<ResumeOptimizationSuggestion[]>([])

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
      setResults(result.suggestions || [])
    } catch {
      setMessage("Resume optimization request failed.")
    } finally {
      setLoading(false)
    }
  }

  function applySuggestion(suggestion: ResumeOptimizationSuggestion) {
    onApplySuggestion(suggestion)

    setResults((current) =>
      current.map((item) =>
        item.id === suggestion.id ? { ...item, applied: true } : item
      )
    )
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
          Review your resume against AI optimization rules. Live OpenAI
          completion will be connected after final prompt testing.
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

      <ResumeOptimizationResults
        results={results}
        onApplySuggestion={applySuggestion}
      />
    </div>
  )
}
