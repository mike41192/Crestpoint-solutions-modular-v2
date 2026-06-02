// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { ResumeCompletionAnalysis } from "@/modules/resume-builder"
import type { ResumeAchievementReport } from "@/modules/intelligence-core/achievement-intelligence"

// =====================================================
// BLOCK: Component Types
// =====================================================

type ResumeCompletionCardProps = {
  analysis: ResumeCompletionAnalysis
  achievementReport?: ResumeAchievementReport
}

// =====================================================
// BLOCK: Helpers
// =====================================================

function getStrengthColor(strength: string) {
  switch (strength) {
    case "Excellent":
      return "#166534"

    case "Strong":
      return "#1d4ed8"

    case "Developing":
      return "#92400e"

    default:
      return "#991b1b"
  }
}

function getAchievementColor(score: number) {
  if (score >= 80) return "#166534"
  if (score >= 60) return "#1d4ed8"
  if (score >= 40) return "#92400e"

  return "#991b1b"
}

// =====================================================
// BLOCK: Component
// =====================================================

export function ResumeCompletionCard({
  analysis,
  achievementReport,
}: ResumeCompletionCardProps) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "16px",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: 700 }}>
            Resume Completion
          </h3>

          <p style={{ marginTop: "4px", color: "#64748b" }}>
            {analysis.completedSections} of {analysis.totalSections} sections
            completed
          </p>
        </div>

        <div
          style={{
            fontSize: "26px",
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          {analysis.completionPercentage}%
        </div>
      </div>

      <div
        style={{
          marginTop: "16px",
          height: "12px",
          borderRadius: "999px",
          background: "#e2e8f0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${analysis.completionPercentage}%`,
            height: "100%",
            background: "#2563eb",
          }}
        />
      </div>

      <div
        style={{
          marginTop: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <strong>Resume Strength:</strong>{" "}
          <span
            style={{
              color: getStrengthColor(analysis.strength),
              fontWeight: 700,
            }}
          >
            {analysis.strength}
          </span>
        </div>

        <div style={{ color: "#64748b" }}>
          {analysis.validationErrors} errors •{" "}
          {analysis.validationWarnings} warnings
        </div>
      </div>

      {achievementReport && (
        <div
          style={{
            marginTop: "18px",
            border: "1px solid #dbeafe",
            borderRadius: "12px",
            background: "#eff6ff",
            padding: "14px",
          }}
        >
          <strong>Achievement Intelligence</strong>

          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <span>Achievement Strength</span>

            <span
              style={{
                color: getAchievementColor(achievementReport.overallScore),
                fontWeight: 800,
              }}
            >
              {achievementReport.overallScore}%
            </span>
          </div>

          <div
            style={{
              marginTop: "10px",
              color: "#475569",
              fontSize: "14px",
            }}
          >
            {achievementReport.strongBullets} strong •{" "}
            {achievementReport.mediumBullets} medium •{" "}
            {achievementReport.weakBullets} weak bullets
          </div>
        </div>
      )}

      <div style={{ marginTop: "18px" }}>
        <strong>Section Status</strong>

        <div
          style={{
            marginTop: "10px",
            display: "grid",
            gap: "8px",
          }}
        >
          {analysis.sections.map((section) => (
            <div
              key={section.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "10px 12px",
              }}
            >
              <span>{section.label}</span>

              <span
                style={{
                  color: section.completed ? "#166534" : "#92400e",
                  fontWeight: 700,
                }}
              >
                {section.completed ? "Complete" : "Incomplete"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
