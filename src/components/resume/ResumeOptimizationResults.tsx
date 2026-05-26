type ResumeOptimizationResultsProps = {
  results: string[]
}

export function ResumeOptimizationResults({
  results,
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
        {results.map((result, index) => (
          <div
            key={`${result}-${index}`}
            style={{
              border: "1px solid #dbeafe",
              borderRadius: "10px",
              padding: "12px",
              background: "#ffffff",
            }}
          >
            <strong>Suggestion {index + 1}</strong>

            <p
              style={{
                marginTop: "6px",
                color: "#334155",
                lineHeight: 1.5,
              }}
            >
              {result}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}