import { membershipTiers, tierRank } from "@/lib/config/tiers.config"

export default function AdminTierSettingsPage() {
  return (
    <main style={{ padding: "32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
          Tier Access Settings
        </h1>

        <p style={{ marginTop: "8px", color: "#64748b" }}>
          Manage membership tiers and prepare access rules for Crestpoint modules.
        </p>
      </div>

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        {membershipTiers.map((tier) => (
          <div
            key={tier}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "20px",
              background: "#ffffff",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 700,
                textTransform: "capitalize",
              }}
            >
              {tier}
            </h2>

            <p style={{ marginTop: "8px", color: "#64748b" }}>
              Access rank: {tierRank[tier]}
            </p>

            <div
              style={{
                marginTop: "16px",
                paddingTop: "12px",
                borderTop: "1px solid #e2e8f0",
                fontSize: "14px",
                color: "#475569",
              }}
            >
              {tier === "free" && "Entry-level access for basic features."}
              {tier === "starter" && "Unlocks entry AI and ATS tools."}
              {tier === "pro" && "Unlocks interview prep and advanced tools."}
              {tier === "premium" && "Unlocks higher-value career systems."}
              {tier === "business" && "For teams, agencies, and expanded usage."}
              {tier === "admin" && "Full owner and system control access."}
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}