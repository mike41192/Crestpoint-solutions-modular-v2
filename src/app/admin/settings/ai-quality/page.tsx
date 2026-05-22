const qualitySections = [
  {
    title: "AI Output Tracking",
    description: "Monitor generated resumes, interviews, cover letters, and coaching responses.",
    status: "Planned",
  },
  {
    title: "Prompt Versions",
    description: "Compare prompt versions and track which prompts perform best.",
    status: "Planned",
  },
  {
    title: "Flagged Outputs",
    description: "Review poor, incomplete, or low-confidence AI responses.",
    status: "Planned",
  },
  {
    title: "Approved Examples",
    description: "Save strong outputs as examples for future AI improvement.",
    status: "Planned",
  },
  {
    title: "Quality Rules",
    description: "Define rules that prevent bad outputs and improve consistency.",
    status: "Planned",
  },
  {
    title: "Module Performance",
    description: "Track AI quality by module, feature, and prompt version.",
    status: "Planned",
  },
]

export default function AdminAIQualitySettingsPage() {
  return (
    <main style={{ padding: "32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
          AI Quality Center
        </h1>

        <p style={{ marginTop: "8px", color: "#64748b" }}>
          Review AI quality, prompt performance, flagged outputs, and learning signals.
        </p>
      </div>

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {qualitySections.map((section) => (
          <div
            key={section.title}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "20px",
              background: "#ffffff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: "18px", fontWeight: 700 }}>
                {section.title}
              </h2>

              <span
                style={{
                  fontSize: "12px",
                  padding: "4px 8px",
                  borderRadius: "999px",
                  background: "#fef3c7",
                  color: "#92400e",
                  whiteSpace: "nowrap",
                }}
              >
                {section.status}
              </span>
            </div>

            <p style={{ marginTop: "10px", color: "#475569", lineHeight: 1.5 }}>
              {section.description}
            </p>
          </div>
        ))}
      </section>
    </main>
  )
}