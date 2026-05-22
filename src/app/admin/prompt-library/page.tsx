const promptLibrarySections = [
  {
    title: "Prompt Sources",
    description: "Connect approved prompt sources and manually import prompt ideas.",
    status: "Planned",
  },
  {
    title: "Draft Prompts",
    description: "Review imported prompts before they can be used by live modules.",
    status: "Planned",
  },
  {
    title: "Approved Prompts",
    description: "View prompts approved for Crestpoint AI modules.",
    status: "Planned",
  },
  {
    title: "Prompt Versions",
    description: "Track changes, test versions, and compare performance.",
    status: "Planned",
  },
  {
    title: "Prompt Testing",
    description: "Run test inputs against prompts before activation.",
    status: "Planned",
  },
  {
    title: "Active Module Prompts",
    description: "See which prompt powers each AI feature.",
    status: "Planned",
  },
]

export default function AdminPromptLibraryPage() {
  return (
    <main style={{ padding: "32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
          Prompt Library
        </h1>

        <p style={{ marginTop: "8px", color: "#64748b" }}>
          Manage curated prompts, prompt versions, module assignments, and quality testing.
        </p>
      </div>

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {promptLibrarySections.map((section) => (
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
                  background: "#e0f2fe",
                  color: "#075985",
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