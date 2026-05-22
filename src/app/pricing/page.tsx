import { ModuleAccessBadge } from "@/components/layout/ModuleAccessBadge"
import { SectionCard } from "@/components/layout/SectionCard"
import { pricingPlans } from "@/lib/config/pricing.config"

export default function PricingPage() {
  return (
    <main style={{ padding: "32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
          Crestpoint Pricing
        </h1>

        <p style={{ marginTop: "8px", color: "#64748b", lineHeight: 1.5 }}>
          Choose the membership tier that fits your job search, interview prep,
          and career growth needs.
        </p>
      </div>

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {pricingPlans.map((plan) => (
          <SectionCard key={plan.tier}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
                {plan.name}
              </h2>

              <ModuleAccessBadge tier={plan.tier} />
            </div>

            <p style={{ marginTop: "10px", color: "#64748b", lineHeight: 1.5 }}>
              {plan.description}
            </p>

            <div style={{ marginTop: "18px" }}>
              <span style={{ fontSize: "32px", fontWeight: 800 }}>
                ${plan.monthlyPrice}
              </span>
              <span style={{ color: "#64748b" }}> / month</span>
            </div>

            <p style={{ marginTop: "6px", color: "#64748b" }}>
              ${plan.yearlyPrice} / year
            </p>

            <a
              href="/dashboard/billing"
              style={{
                display: "inline-block",
                marginTop: "18px",
                padding: "10px 16px",
                borderRadius: "12px",
                background: "#2563eb",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Choose Plan
            </a>
          </SectionCard>
        ))}
      </section>
    </main>
  )
}