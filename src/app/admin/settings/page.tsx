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
    title: "Advanced",
    description: "Developer and system controls.",
    href: "/admin/settings/advanced",
  },
]

export default function AdminSettingsPage() {
  return (
    <main style={{ padding: "32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
          System Settings
        </h1>

        <p style={{ marginTop: "8px", color: "#64748b" }}>
          Manage Crestpoint modules, pricing, access, appearance, and system controls.
        </p>
      </div>

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
              display: "block",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "20px",
              background: "#ffffff",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
              {section.title}
            </h2>

            <p style={{ marginTop: "8px", color: "#64748b", lineHeight: 1.5 }}>
              {section.description}
            </p>
          </a>
        ))}
      </section>
    </main>
  )
}