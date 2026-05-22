import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/layout/SectionCard"

export default function LoginPage() {
  return (
    <main style={{ padding: "32px" }}>
      <PageHeader
        title="Sign In"
        description="Access your Crestpoint dashboard, modules, billing, and career tools."
      />

      <SectionCard>
        <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
          Authentication Coming Soon
        </h2>

        <p style={{ marginTop: "8px", color: "#64748b", lineHeight: 1.5 }}>
          Supabase authentication will be connected after the database project
          and environment variables are configured.
        </p>

        <a
          href="/dashboard"
          style={{
            display: "inline-block",
            marginTop: "16px",
            padding: "10px 16px",
            borderRadius: "12px",
            background: "#2563eb",
            color: "#ffffff",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Continue to Dashboard Preview
        </a>
      </SectionCard>
    </main>
  )
}