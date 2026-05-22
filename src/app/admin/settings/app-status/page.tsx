import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/layout/SectionCard"
import {
  getMissingAppEnvKeys,
  isAppEnvConfigured,
} from "@/lib/config/app-env"

export default function AppStatusPage() {
  const missingKeys = getMissingAppEnvKeys()
  const configured = isAppEnvConfigured()

  return (
    <main style={{ padding: "32px" }}>
      <PageHeader
        title="Application Environment Status"
        description="Review whether core application environment variables are configured."
      />

      <SectionCard>
        <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
          Application Configuration
        </h2>

        <p
          style={{
            marginTop: "8px",
            color: configured ? "#166534" : "#991b1b",
          }}
        >
          Status: <strong>{configured ? "Configured" : "Missing Keys"}</strong>
        </p>

        <p style={{ marginTop: "8px", color: "#64748b", lineHeight: 1.5 }}>
          This page validates core frontend application environment variables
          required for routing, authentication, and deployment readiness.
        </p>

        {!configured && (
          <div style={{ marginTop: "16px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700 }}>
              Missing Environment Variables
            </h3>

            <ul style={{ marginTop: "12px", paddingLeft: "20px" }}>
              {missingKeys.map((key) => (
                <li key={key} style={{ marginBottom: "6px" }}>
                  <code>{key}</code>
                </li>
              ))}
            </ul>
          </div>
        )}
      </SectionCard>

      <section style={{ marginTop: "16px" }}>
        <SectionCard>
          <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
            API Diagnostic Endpoint
          </h2>

          <p style={{ marginTop: "8px", color: "#64748b", lineHeight: 1.5 }}>
            Application environment configuration can also be checked through:
          </p>

          <code
            style={{
              display: "block",
              marginTop: "12px",
              padding: "12px",
              borderRadius: "12px",
              background: "#f8fafc",
              color: "#334155",
            }}
          >
            /api/admin/app-status
          </code>
        </SectionCard>
      </section>
    </main>
  )
}