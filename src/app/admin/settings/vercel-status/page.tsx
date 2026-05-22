import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/layout/SectionCard"

const settingsSections = [
  {
    title: "General",
    description: "Core system settings.",
    href: "/admin/settings/general",
  },
  {
    title: "Appearance",
    description: "Theme, colors, and layout settings.",
    href: "/admin/settings/appearance",
  },
  {
    title: "Modules",
    description: "Enable modules and manage access.",
    href: "/admin/settings/modules",
  },
  {
    title: "Tiers",
    description: "Manage membership tier rules.",
    href: "/admin/settings/tiers",
  },
  {
    title: "Access Test",
    description: "Verify module access rules across all membership tiers.",
    href: "/admin/settings/access-test",
  },
  {
    title: "Pricing",
    description: "Review membership pricing.",
    href: "/admin/settings/pricing",
  },
  {
    title: "Billing Status",
    description: "Check Stripe keys, price IDs, and billing readiness.",
    href: "/admin/settings/billing-status",
  },
  {
    title: "Supabase Status",
    description: "Check database, auth, and Supabase environment readiness.",
    href: "/admin/settings/supabase-status",
  },
  {
    title: "App Status",
    description: "Check core application environment readiness.",
    href: "/admin/settings/app-status",
  },
  {
    title: "Vercel Status",
    description: "Check deployment and hosting environment readiness.",
    href: "/admin/settings/vercel-status",
  },
  {
    title: "System Status",
    description: "Review billing, AI, module gating, and platform readiness.",
    href: "/admin/settings/system-status",
  },
  {
    title: "Usage Limits",
    description: "Control monthly usage limits.",
    href: "/admin/settings/usage",
  },
  {
    title: "Users",
    description: "Manage user account access.",
    href: "/admin/settings/users",
  },
  {
    title: "AI Quality",
    description: "Review AI performance and prompt quality.",
    href: "/admin/settings/ai-quality",
  },
  {
    title: "AI Status",
    description: "Check OpenAI configuration and AI system readiness.",
    href: "/admin/settings/ai-status",
  },
  {
    title: "Advanced",
    description: "Developer and system controls.",
    href: "/admin/settings/advanced",
  },
]

export default function AdminSettingsPage() {
  return (
    <main style={{ padding: "32px" }}>
      <PageHeader
        title="System Settings"
        description="Manage Crestpoint modules, pricing, access, appearance, billing, AI systems, database readiness, deployment configuration, application configuration, and platform controls."
      />

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {settingsSections.map((section) => (
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

              <p
                style={{
                  marginTop: "8px",
                  color: "#64748b",
                  lineHeight: 1.5,
                }}
              >
                {section.description}
              </p>
            </SectionCard>
          </a>
        ))}
      </section>
    </main>
  )
}
