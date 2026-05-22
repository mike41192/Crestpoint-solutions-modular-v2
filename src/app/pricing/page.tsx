import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/layout/SectionCard"

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    features: [
      "Basic dashboard access",
      "Limited resume scans",
      "Basic ATS scoring",
      "Starter interview practice",
    ],
  },
  {
    name: "Starter",
    price: "$19/mo",
    features: [
      "Expanded resume optimization",
      "LinkedIn optimization",
      "Additional ATS scans",
      "Job tracker access",
    ],
  },
  {
    name: "Pro",
    price: "$49/mo",
    features: [
      "AI interviewer access",
      "Interview academy",
      "Advanced ATS analysis",
      "Networking outreach tools",
    ],
  },
  {
    name: "Premium",
    price: "$99/mo",
    features: [
      "Unlimited AI usage",
      "Advanced analytics",
      "Priority AI processing",
      "Portfolio builder",
    ],
  },
  {
    name: "Business",
    price: "$299/mo",
    features: [
      "Team management",
      "Hiring analytics",
      "Employer-side tools",
      "Future recruiting systems",
    ],
  },
]

export default function PricingPage() {
  return (
    <main style={{ padding: "32px" }}>
      <PageHeader
        title="Membership Pricing"
        description="Choose the Crestpoint membership tier that matches your career growth needs."
      />

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {pricingTiers.map((tier) => (
          <SectionCard key={tier.name}>
            <h2 style={{ fontSize: "24px", fontWeight: 700 }}>
              {tier.name}
            </h2>

            <p
              style={{
                marginTop: "8px",
                fontSize: "20px",
                fontWeight: 700,
                color: "#2563eb",
              }}
            >
              {tier.price}
            </p>

            <ul style={{ marginTop: "16px", paddingLeft: "20px" }}>
              {tier.features.map((feature) => (
                <li
                  key={feature}
                  style={{
                    marginBottom: "8px",
                    color: "#475569",
                  }}
                >
                  {feature}
                </li>
              ))}
            </ul>
          </SectionCard>
        ))}
      </section>
    </main>
  )
}