import { pricingPlans } from "@/lib/config/pricing.config"

export default function AdminPricingSettingsPage() {
  return (
    <main style={{ padding: "32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
          Pricing Settings
        </h1>

        <p style={{ marginTop: "8px", color: "#64748b" }}>
          Review membership pricing before database-controlled pricing is enabled.
        </p>
      </div>

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        {pricingPlans.map((plan) => (
          <div
            key={plan.tier}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "20px",
              background: "#ffffff",
            }}
          >
            <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
              {plan.name}
            </h2>

            <p style={{ marginTop: "8px", color: "#64748b" }}>
              {plan.description}
            </p>

            <div style={{ marginTop: "16px" }}>
              <strong>${plan.monthlyPrice}</strong>
              <span style={{ color: "#64748b" }}> / month</span>
            </div>

            <div style={{ marginTop: "8px" }}>
              <strong>${plan.yearlyPrice}</strong>
              <span style={{ color: "#64748b" }}> / year</span>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}