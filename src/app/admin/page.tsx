import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/layout/SectionCard"

const adminSections = [
  {
    title: "System Settings",
    description:
      "Manage modules, access tiers, diagnostics, backups, cleanup rules, and platform controls.",
    href: "/admin/settings",
  },
  {
    title: "Prompt Library",
    description:
      "Manage curated prompts, prompt versions, source imports, and module prompt assignments.",
    href: "/admin/prompt-library",
  },
  {
    title: "AI Quality Center",
    description:
      "Review AI output quality, flagged responses, approved examples, and module AI performance.",
    href: "/admin/ai-quality",
  },
  {
    title: "Admin Analytics",
    description:
      "Review revenue, module usage, AI performance, conversion funnels, and system health.",
    href: "/admin/analytics",
  },
]

export default function AdminHomePage() {
  return (
    <main style={{ padding: "32px" }}>
      <PageHeader
        title="Admin Command Center"
        description="Owner controls for Crestpoint modules, AI systems, billing, diagnostics, analytics, and platform operations."
      />

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {adminSections.map((section) => (
          <a
            key={section.href}
            href={section.href}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <SectionCard>
              <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
                {section.title}
              </h2>

              <p style={{ marginTop: "8px", color: "#64748b", lineHeight: 1.5 }}>
                {section.description}
              </p>
            </SectionCard>
          </a>
        ))}
      </section>
    </main>
  )
}