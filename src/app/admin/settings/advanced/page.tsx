import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/layout/SectionCard"

const advancedItems = [
  {
    title: "Environment Diagnostics",
    description:
      "Use system status pages to verify App, Supabase, Stripe, OpenAI, Vercel, and GitHub readiness.",
  },
  {
    title: "Backup & Rollback",
    description:
      "Use backup status, module registry, and rollback documentation before major module work.",
  },
  {
    title: "Deprecated File Cleanup",
    description:
      "Use deprecated file tracking and cleanup checklist before deleting replaced files.",
  },
  {
    title: "Module Standardization",
    description:
      "All modules should follow the standard config, types, schema, service, usage, tutorial, and backup structure.",
  },
]

export default function AdvancedSettingsPage() {
  return (
    <main style={{ padding: "32px" }}>
      <PageHeader
        title="Advanced Settings"
        description="Developer-focused controls, diagnostics, rollback guidance, and architecture standards."
      />

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {advancedItems.map((item) => (
          <SectionCard key={item.title}>
            <h2 style={{ fontSize: "18px", fontWeight: 700 }}>
              {item.title}
            </h2>

            <p style={{ marginTop: "8px", color: "#64748b", lineHeight: 1.5 }}>
              {item.description}
            </p>
          </SectionCard>
        ))}
      </section>
    </main>
  )
}