import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/layout/SectionCard"

const securityRules = [
  "Never commit real secrets to GitHub.",
  ".env.example must contain placeholders only.",
  ".env.local must stay ignored by Git.",
  "Rotate keys immediately if exposed.",
  "Use Vercel environment variables for production secrets.",
  "Run git status before every push.",
]

export default function SecurityStatusPage() {
  return (
    <main style={{ padding: "32px" }}>
      <PageHeader
        title="Security Status"
        description="Review environment secret rules, safe configuration practices, and security cleanup requirements."
      />

      <SectionCard>
        <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
          Environment Secret Rules
        </h2>

        <ul style={{ marginTop: "16px", paddingLeft: "20px" }}>
          {securityRules.map((rule) => (
            <li key={rule} style={{ marginBottom: "8px", color: "#475569" }}>
              {rule}
            </li>
          ))}
        </ul>

        <code
          style={{
            display: "block",
            marginTop: "20px",
            padding: "12px",
            borderRadius: "12px",
            background: "#f8fafc",
            color: "#334155",
          }}
        >
          docs/security/environment-secrets.md
        </code>
      </SectionCard>
    </main>
  )
}