import { getModuleAccess } from "@/lib/access/getModuleAccess"
import { membershipTiers } from "@/lib/config/tiers.config"
import { modulesConfig } from "@/lib/config/modules.config"

export default function AccessTestPage() {
  return (
    <main style={{ padding: "32px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
        Module Access Test
      </h1>

      <p style={{ marginTop: "8px", color: "#64748b" }}>
        Verify which membership tiers can access each module.
      </p>

      <section style={{ marginTop: "24px", display: "grid", gap: "16px" }}>
        {modulesConfig.map((module) => (
          <div
            key={module.key}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "20px",
              background: "#ffffff",
            }}
          >
            <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
              {module.name}
            </h2>

            <div
              style={{
                marginTop: "12px",
                display: "grid",
                gap: "8px",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              }}
            >
              {membershipTiers.map((tier) => {
                const { access } = getModuleAccess({
                  userTier: tier,
                  moduleKey: module.key,
                  isAdmin: tier === "admin",
                })

                return (
                  <div
                    key={tier}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "10px",
                      background: access.allowed ? "#dcfce7" : "#fee2e2",
                      color: access.allowed ? "#166534" : "#991b1b",
                      textTransform: "capitalize",
                    }}
                  >
                    {tier}: {access.allowed ? "Allowed" : "Locked"}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}