import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/layout/SectionCard"

const userControls = [
  {
    title: "Account Access",
    description:
      "Prepare controls for enabling, disabling, or reviewing user account access.",
  },
  {
    title: "Membership Tier",
    description:
      "Prepare controls for reviewing and adjusting a user's current membership tier.",
  },
  {
    title: "Usage Review",
    description:
      "Prepare visibility into AI credits, uploads, exports, scans, and tracked jobs.",
  },
  {
    title: "Admin Override",
    description:
      "Prepare owner-only controls for granting temporary access or admin permissions.",
  },
]

export default function UsersSettingsPage() {
  return (
    <main style={{ padding: "32px" }}>
      <PageHeader
        title="User Access Settings"
        description="Manage user access, membership tiers, usage visibility, and admin overrides."
      />

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {userControls.map((control) => (
          <SectionCard key={control.title}>
            <h2 style={{ fontSize: "18px", fontWeight: 700 }}>
              {control.title}
            </h2>

            <p style={{ marginTop: "8px", color: "#64748b", lineHeight: 1.5 }}>
              {control.description}
            </p>
          </SectionCard>
        ))}
      </section>
    </main>
  )
}