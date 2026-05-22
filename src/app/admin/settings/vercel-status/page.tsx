import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/layout/SectionCard"
import {
  getMissingVercelEnvKeys,
  isVercelConfigured,
} from "@/lib/vercel/vercel-env"

export default function VercelStatusPage() {
  const missingKeys = getMissingVercelEnvKeys()
  const configured = isVercelConfigured()

  return (
    <main style={{ padding: "32px" }}>
      <PageHeader
        title="Vercel Deployment Status"
        description="Review whether Vercel deployment environment variables are configured."
      />

      <SectionCard>
        <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
          Vercel Configuration
        </h2>

        <p style={{ marginTop: "8px", color: configured ? "#166534" : "#991b1b" }}>
          Status: <strong>{configured ? "Configured" : "Missing Keys"}</strong>
        </p>

        {!configured && (
          <ul style={{ marginTop: "12px", paddingLeft: "20px" }}>
            {missingKeys.map((key) => (
              <li key={key}>
                <code>{key}</code>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </main>
  )
}