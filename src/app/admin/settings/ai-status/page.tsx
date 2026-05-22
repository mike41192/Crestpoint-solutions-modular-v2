import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/layout/SectionCard"
import {
  getMissingOpenAIEnvKeys,
  isOpenAIConfigured,
} from "@/lib/ai/openai-env"

export default function AIStatusPage() {
  const missingKeys = getMissingOpenAIEnvKeys()
  const configured = isOpenAIConfigured()

  return (
    <main style={{ padding: "32px" }}>
      <PageHeader
        title="AI System Status"
        description="Review whether AI providers are configured and ready for Crestpoint modules."
      />

      <SectionCard>
        <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
          OpenAI Configuration
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
          This page checks whether required OpenAI environment variable names are
          present. It never displays secret values.
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
            AI configuration can also be checked through:
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
            /api/admin/ai-status
          </code>
        </SectionCard>
      </section>
    </main>
  )
}