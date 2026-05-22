import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/layout/SectionCard"
import {
  getMissingStripeEnvKeys,
  isStripeConfigured,
} from "@/lib/stripe/stripe-env"

export default function BillingStatusPage() {
  const missingKeys = getMissingStripeEnvKeys()
  const configured = isStripeConfigured()

  return (
    <main style={{ padding: "32px" }}>
      <PageHeader
        title="Billing System Status"
        description="Review whether Stripe billing is configured and ready for checkout."
      />

      <SectionCard>
        <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
          Stripe Configuration
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
          This page checks whether required Stripe environment variable names are
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
            Billing configuration can also be checked through:
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
            /api/admin/billing-status
          </code>
        </SectionCard>
      </section>
    </main>
  )
}