const analyticsSections = [
  {
    title: "Revenue Metrics",
    description: "Track subscriptions, upgrades, churn, and membership revenue.",
    metric: "Pending",
  },
  {
    title: "Module Usage",
    description: "See which Crestpoint modules users interact with most.",
    metric: "Pending",
  },
  {
    title: "AI Performance",
    description: "Measure prompt quality, feedback scores, and regeneration rates.",
    metric: "Pending",
  },
  {
    title: "Conversion Funnel",
    description: "Track visitor to signup, signup to paid, and upgrade paths.",
    metric: "Pending",
  },
  {
    title: "User Retention",
    description: "Monitor repeat usage, feature adoption, and churn risk.",
    metric: "Pending",
  },
  {
    title: "System Health",
    description: "Monitor failed requests, API usage, and service health signals.",
    metric: "Pending",
  },
]

export default function AdminAnalyticsPage() {
  return (
    <main style={{ padding: "32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
          Admin Analytics
        </h1>

        <p style={{ marginTop: "8px", color: "#64748b" }}>
          Review business, product, AI, and system performance signals.
        </p>
      </div>

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {analyticsSections.map((section) => (
          <div
            key={section.title}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "20px",
              background: "#ffffff",
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: 700 }}>
              {section.title}
            </h2>

            <p style={{ marginTop: "10px", color: "#475569", lineHeight: 1.5 }}>
              {section.description}
            </p>

            <div
              style={{
                marginTop: "16px",
                borderTop: "1px solid #e2e8f0",
                paddingTop: "12px",
                color: "#64748b",
              }}
            >
              Status: <strong>{section.metric}</strong>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}