import { modulesConfig } from "@/lib/config/modules.config"

export default function AdminModulesSettingsPage() {
  return (
    <main style={{ padding: "32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
          Module Settings
        </h1>

        <p style={{ marginTop: "8px", color: "#64748b" }}>
          Control which Crestpoint modules are active and which membership tier can access them.
        </p>
      </div>

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {modulesConfig.map((module) => (
          <div
            key={module.key}
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
                {module.name}
              </h2>

              <span
                style={{
                  fontSize: "12px",
                  padding: "4px 8px",
                  borderRadius: "999px",
                  background: module.enabled ? "#dcfce7" : "#fee2e2",
                  color: module.enabled ? "#166534" : "#991b1b",
                  whiteSpace: "nowrap",
                }}
              >
                {module.enabled ? "Enabled" : "Disabled"}
              </span>
            </div>

            <p style={{ marginTop: "10px", color: "#475569", lineHeight: 1.5 }}>
              {module.description}
            </p>

            <div
              style={{
                marginTop: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid #e2e8f0",
                paddingTop: "12px",
              }}
            >
              <span style={{ fontSize: "13px", color: "#64748b" }}>
                Required Tier
              </span>

              <strong style={{ textTransform: "capitalize" }}>
                {module.requiredTier}
              </strong>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}