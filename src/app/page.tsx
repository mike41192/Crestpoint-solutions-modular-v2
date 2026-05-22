import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/layout/SectionCard"

const landingSections = [
  {
    title: "Career Dashboard",
    description:
      "Access resume tools, ATS scoring, interview prep, job tracking, and career analytics.",
    href: "/dashboard",
  },
  {
    title: "Pricing",
    description:
      "Review membership tiers, module access, and upgrade options.",
    href: "/pricing",
  },
  {
    title: "Admin Command Center",
    description:
      "Manage platform settings, diagnostics, AI quality, billing, and module access.",
    href: "/admin",
  },
  {
    title: "Sign In",
    description:
      "Access your account when authentication is connected.",
    href: "/auth/login",
  },
]

export default function HomePage() {
  return (
    <main style={{ padding: "32px" }}>
      <PageHeader
        title="Crestpoint Solutions"
        description="A modular AI career operating system for resumes, interviews, job tracking, learning, and hiring success."
      />

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {landingSections.map((section) => (
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