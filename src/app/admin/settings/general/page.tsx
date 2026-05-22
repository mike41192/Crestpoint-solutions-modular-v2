import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/layout/SectionCard"

const generalSettings = [
  {
    label: "Project Name",
    value: "Crestpoint Solutions Modular V2",
  },
  {
    label: "Version",
    value: "1.0.0",
  },
  {
    label: "Active Build Branch",
    value: "modular-v2-build",
  },
  {
    label: "Environment",
    value: process.env.APP_ENV || "development",
  },
]

export default function GeneralSettingsPage() {
  return (
    <main style={{ padding: "32px" }}>
      <PageHeader
        title="General Settings"
        description="Review core platform settings for the Crestpoint Modular V2 build."
      />

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {generalSettings.map((setting) => (
          <SectionCard key={setting.label}>
            <h2 style={{ fontSize: "18px", fontWeight: 700 }}>
              {setting.label}
            </h2>

            <p style={{ marginTop: "8px", color: "#64748b" }}>
              {setting.value}
            </p>
          </SectionCard>
        ))}
      </section>
    </main>
  )
}