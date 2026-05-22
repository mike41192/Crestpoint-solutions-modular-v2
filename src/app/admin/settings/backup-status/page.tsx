import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/layout/SectionCard"

const backupRules = [
  "Run npm run build before every backup.",
  "Commit every successful phase.",
  "Push every stable checkpoint to GitHub.",
  "Tag major stable milestones.",
  "Keep rollback notes in docs/backups.",
  "Do not proceed after a failed build.",
]

export default function BackupStatusPage() {
  return (
    <main style={{ padding: "32px" }}>
      <PageHeader
        title="Backup & Rollback Status"
        description="Review the required backup rules before continuing major Crestpoint module work."
      />

      <SectionCard>
        <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
          Backup Rules
        </h2>

        <ul style={{ marginTop: "16px", paddingLeft: "20px" }}>
          {backupRules.map((rule) => (
            <li key={rule} style={{ marginBottom: "8px", color: "#475569" }}>
              {rule}
            </li>
          ))}
        </ul>
      </SectionCard>

      <section style={{ marginTop: "16px" }}>
        <SectionCard>
          <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
            Recommended Stable Tag
          </h2>

          <code
            style={{
              display: "block",
              marginTop: "12px",
              padding: "12px",
              borderRadius: "12px",
              background: "#f8fafc",
              color: "#334155",
            }}
          >
            v2-phase-72-backup-status
          </code>
        </SectionCard>
      </section>
    </main>
  )
}