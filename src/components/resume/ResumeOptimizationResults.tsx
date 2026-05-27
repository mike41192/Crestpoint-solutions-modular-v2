import type { ResumeOptimizationSuggestion } from "@/modules/resume-builder"

type ResumeOptimizationResultsProps = {
  results: ResumeOptimizationSuggestion[]
  onApplySuggestion: (suggestion: ResumeOptimizationSuggestion) => void
}

export function ResumeOptimizationResults({
  results,
  onApplySuggestion,
}: ResumeOptimizationResultsProps) {
  if (results.length === 0) {
    return (
      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "14px",
          background: "#f8fafc",
        }}
      >
        <strong>No optimization results yet.</strong>

        <p style={{ marginTop: "6px", color: "#64748b" }}>
          Run AI optimization to generate recommendations and improvements.
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        border: "1px solid #bfdbfe",
        borderRadius: "12px",
        padding: "14px",
        background: "#eff6ff",
      }}
    >
      <h3 style={{ fontSize: "18px", fontWeight: 700 }}>
        AI Optimization Results
      </h3>

      <div
        style={{
          marginTop: "12px",
          display: "grid",
          gap: "12px",
        }}
      >
        {results.map((result) => (
          <div
            key={result.id}
            style={{
              border: "1px solid #dbeafe",
              borderRadius: "10px",
              padding: "12px",
              background: "#ffffff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <strong>{result.title}</strong>

              <span
                style={{
                  textTransform: "uppercase",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#1d4ed8",
                }}
              >
                {result.category}
              </span>
            </div>

            <p
              style={{
                marginTop: "6px",
                color: "#334155",
                lineHeight: 1.5,
              }}
            >
              {result.recommendation}
            </p>

            {result.suggestedText && (
              <div
                style={{
                  marginTop: "10px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  padding: "10px",
                  background: "#f8fafc",
                }}
              >
                <strong>Suggested text</strong>

                <p style={{ marginTop: "6px", color: "#475569" }}>
                  {result.suggestedText}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => onApplySuggestion(result)}
              disabled={result.applied}
              style={{
                marginTop: "12px",
                border: "0",
                borderRadius: "12px",
                padding: "10px 14px",
                background: result.applied ? "#94a3b8" : "#2563eb",
                color: "#ffffff",
                fontWeight: 700,
                cursor: result.applied ? "not-allowed" : "pointer",
              }}
            >
              {result.applied ? "Applied" : "Apply Suggestion"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
