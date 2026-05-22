import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/layout/SectionCard"

const billingSections = [
  {
    title: "Current Membership",
    description:
      "Review the currently active membership tier and billing status.",
  },
  {
    title: "Usage Limits",
    description:
      "Track AI credits, scans, exports, interview sessions, and uploads.",
  },
  {
    title: "Upgrade Plan",
    description:
      "Upgrade to higher membership tiers for expanded access and AI usage.",
  },
  {
    title: "Billing Portal",
    description:
      "Future Stripe billing portal integration for subscription management.",
  },
]

export default function BillingDashboardPage() {
  return (
    <main style={{ padding: "32px" }}>
      <PageHeader
        title="Billing Dashboard"
        description="Review subscription access, usage limits, membership tiers, and billing controls."
      />

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {billingSections.map((section) => (
          <SectionCard key={section.title}>
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
        ))}
      </section>
    </main>
  )
}