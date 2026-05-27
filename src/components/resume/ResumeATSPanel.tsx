import type { ATSAnalysisResult } from "@/modules/resume-builder"

type ResumeATSPanelProps = {
  result: ATSAnalysisResult
}

function getScoreLabel(score: number) {
  if (score >= 85) {
    return "Excellent Match"
  }

  if (score >= 70) {
    return "Strong Match"
  }

  if (score >= 50) {
    return "Developing Match"
  }

  return "Needs Optimization"
}

function getScoreColor(score: number) {
  if (score >= 85) {
    return "#166534"
  }

  if (score >= 70) {
    return "#1d4ed8"
  }

  if (score >= 50) {
    return "#92400e"
  }

  return "#991b1b"
}

export function ResumeATSPanel({ result }: ResumeATSPanelProps) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "16px",
        background: "#ffffff",
        display: "grid",
        gap: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: 700 }}>
            ATS Match Score
          </h3>

          <p style={{ marginTop: "4px", color: "#64748b" }}>
            {getScoreLabel(result.score)}
          </p>
        </div>

        <div
          style={{
            fontSize: "30px",
            fontWeight: 800,
            color: getScoreColor(result.score),
          }}
        >
          {result.score}%
        </div>
      </div>

      <div
        style={{
          height: "12px",
          borderRadius: "999px",
          background: "#e2e8f0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${result.score}%`,
            height: "100%",
            background: getScoreColor(result.score),
          }}
        />
      </div>

      <div>
        <strong>Matched Keywords</strong>

        <div
          style={{
            marginTop: "8px",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {result.matchedKeywords.length > 0 ? (
            result.matchedKeywords.map((keyword) => (
              <span
                key={keyword}
                style={{
                  borderRadius: "999px",
                  padding: "6px 10px",
                  background: "#dcfce7",
                  color: "#166534",
                  fontWeight: 700,
                  fontSize: "13px",
                }}
              >
                {keyword}
              </span>
            ))
          ) : (
            <p style={{ color: "#64748b" }}>No matched keywords yet.</p>
          )}
        </div>
      </div>

      <div>
        <strong>Missing Keywords</strong>

        <div
          style={{
            marginTop: "8px",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {result.missingKeywords.length > 0 ? (
            result.missingKeywords.map((keyword) => (
              <span
                key={keyword}
                style={{
                  borderRadius: "999px",
                  padding: "6px 10px",
                  background: "#fee2e2",
                  color: "#991b1b",
                  fontWeight: 700,
                  fontSize: "13px",
                }}
              >
                {keyword}
              </span>
            ))
          ) : (
            <p style={{ color: "#64748b" }}>No missing keywords found.</p>
          )}
        </div>
      </div>

      <div>
        <strong>Recommendations</strong>

        <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
          {result.recommendations.map((recommendation) => (
            <li
              key={recommendation}
              style={{
                color: "#475569",
                marginBottom: "8px",
              }}
            >
              {recommendation}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}