import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/layout/SectionCard"

const accountSections = [
  {
    title: "Profile Information",
    description:
      "Manage personal details, career goals, contact information, and profile preferences.",
  },
  {
    title: "Membership Access",
    description:
      "Review your current tier and which Crestpoint modules are available to your account.",
  },
  {
    title: "Notification Preferences",
    description:
      "Future controls for email updates, reminders, job alerts, and interview prep notifications.",
  },
  {
    title: "Security",
    description:
      "Future Supabase authentication controls for login, sessions, and account protection.",
  },
]

export default function AccountSettingsPage() {
  return (
    <main style={{ padding: "32px" }}>
      <PageHeader
        title="Account Settings"
        description="Manage your profile, membership access, notifications, and account security."
      />

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {accountSections.map((section) => (
          <SectionCard key={section.title}>
            <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
              {section.title}
            </h2>

            <p style={{ marginTop: "8px", color: "#64748b", lineHeight: 1.5 }}>
              {section.description}
            </p>
          </SectionCard>
        ))}
      </section>
    </main>
  )
}
