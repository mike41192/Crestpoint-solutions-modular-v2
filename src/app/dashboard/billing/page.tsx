import { UpgradePrompt } from "@/components/billing/UpgradePrompt"
import { ModuleAccessBadge } from "@/components/layout/ModuleAccessBadge"
import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { SectionCard } from "@/components/layout/SectionCard"
import { FirstUseTutorial } from "@/components/onboarding/FirstUseTutorial"
import { pricingPlans } from "@/lib/config/pricing.config"
import { testUserConfig } from "@/lib/config/test-user.config"

export default function BillingDashboardPage() {
  return (
    <ModulePageLayout
      title="Billing"
      description="Review your membership, billing status, plan access, and upgrade options."
    >
      <FirstUseTutorial moduleKey="billing_manager" />

      <section style={{ marginTop: "24px" }}>
        <SectionCard>
          <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
            Current Membership
          </h2>

          <p style={{ marginTop: "8px", color: "#64748b" }}>
            Your current test membership tier is:
          </p>

          <div style={{ marginTop: "12px" }}>
            <ModuleAccessBadge tier={testUserConfig.tier} />
          </div>

          <UpgradePrompt requiredTier="starter" />
        </SectionCard>
      </section>

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          marginTop: "24px",
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
              <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
                {plan.name}
              </h2>

              <ModuleAccessBadge tier={plan.tier} />
            </div>

            <p style={{ marginTop: "10px", color: "#64748b", lineHeight: 1.5 }}>
              {plan.description}
            </p>

            <div style={{ marginTop: "16px" }}>
              <strong>${plan.monthlyPrice}</strong>
              <span style={{ color: "#64748b" }}> / month</span>
            </div>

            <div style={{ marginTop: "6px", color: "#64748b" }}>
              ${plan.yearlyPrice} / year
            </div>

            <button
              type="button"
              style={{
                marginTop: "16px",
                border: "0",
                borderRadius: "12px",
                padding: "10px 16px",
                background: "#2563eb",
                color: "#ffffff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Select {plan.name}
            </button>
          </SectionCard>
        ))}
      </section>
    </ModulePageLayout>
  )
}