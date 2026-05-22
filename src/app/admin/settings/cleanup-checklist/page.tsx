import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/layout/SectionCard"

const checklistItems = [
  "Verify imports are removed.",
  "Verify routes are no longer active.",
  "Run npm run build before deletion.",
  "Verify rollback checkpoint exists.",
  "Document deprecated files before removal.",
  "Run final build after cleanup.",
]

export default function CleanupChecklistPage() {
  return (
    <main style={{ padding: "32px" }}>
      <PageHeader
        title="Cleanup Verification Checklist"
        description="Use this process before deleting deprecated or replaced files."
      />

      <SectionCard>
        <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
          Required Verification Steps
        </h2>

        <ul style={{ marginTop: "16px", paddingLeft: "20px" }}>
          {checklistItems.map((item) => (
            <li key={item} style={{ marginBottom: "8px", color: "#475569" }}>
              {item}
            </li>
          ))}
        </ul>

        <code
          style={{
            display: "block",
            marginTop: "20px",
            padding: "12px",
            borderRadius: "12px",
            background: "#f8fafc",
            color: "#334155",
          }}
        >
          docs/cleanup-checklist.md
        </code>
      </SectionCard>
    </main>
  )
}