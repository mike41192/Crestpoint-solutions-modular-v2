import { resumeExportOptions } from "@/modules/resume-builder"

export function ResumeExportOptions() {
  return (
    <div
      style={{
        display: "grid",
        gap: "12px",
        marginBottom: "16px",
      }}
    >
      {resumeExportOptions.map((option) => (
        <div
          key={option.format}
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "14px",
            background: option.enabled ? "#ffffff" : "#f8fafc",
          }}
        >
          <strong>{option.label}</strong>

          <p style={{ marginTop: "6px", color: "#64748b" }}>
            {option.description}
          </p>

          <p
            style={{
              marginTop: "8px",
              color: option.enabled ? "#166534" : "#92400e",
              fontWeight: 700,
            }}
          >
            {option.enabled ? "Available now" : "Planned"}
          </p>
        </div>
      ))}
    </div>
  )
}