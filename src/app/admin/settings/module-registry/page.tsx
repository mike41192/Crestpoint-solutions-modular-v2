import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/layout/SectionCard"

export default function ModuleRegistryPage() {
  return (
    <main style={{ padding: "32px" }}>
      <PageHeader
        title="Stable Module Registry"
        description="Track stable module checkpoints, rollback-safe versions, and restore instructions."
      />

      <SectionCard>
        <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
          Registry Document
        </h2>

        <p style={{ marginTop: "8px", color: "#64748b" }}>
          Stable module checkpoints should be documented after every successful module validation.
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
          docs/backups/stable-module-registry.md
        </code>
      </SectionCard>
    </main>
  )
}