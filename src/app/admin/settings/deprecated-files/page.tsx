import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/layout/SectionCard"

export default function DeprecatedFilesPage() {
  return (
    <main style={{ padding: "32px" }}>
      <PageHeader
        title="Deprecated Files Tracking"
        description="Track outdated files, replacements, rollback-safe removals, and cleanup verification."
      />

      <SectionCard>
        <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
          Tracking Document
        </h2>

        <p style={{ marginTop: "8px", color: "#64748b" }}>
          Deprecated files should be logged before deletion.
        </p>

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
          docs/deprecated-files.md
        </code>
      </SectionCard>
    </main>
  )
}