import type { ResumeValidationIssue } from "@/modules/resume-builder"

type ResumeValidationPanelProps = {
  issues: ResumeValidationIssue[]
}

export function ResumeValidationPanel({ issues }: ResumeValidationPanelProps) {
  if (issues.length === 0) {
    return (
      <div
        style={{
          border: "1px solid #bbf7d0",
          borderRadius: "12px",
          padding: "12px",
          background: "#f0fdf4",
          color: "#166534",
        }}
      >
        <strong>Resume looks complete enough to continue.</strong>
      </div>
    )
  }

  return (
    <div
      style={{
        border: "1px solid #fde68a",
        borderRadius: "12px",
        padding: "12px",
        background: "#fffbeb",
      }}
    >
      <strong style={{ color: "#92400e" }}>Resume Review Notes</strong>

      <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
        {issues.map((issue) => (
          <li
            key={`${issue.field}-${issue.message}`}
            style={{
              marginBottom: "8px",
              color: issue.severity === "error" ? "#991b1b" : "#92400e",
            }}
          >
            <strong style={{ textTransform: "capitalize" }}>
              {issue.severity}:
            </strong>{" "}
            {issue.message}
          </li>
        ))}
      </ul>
    </div>
  )
}