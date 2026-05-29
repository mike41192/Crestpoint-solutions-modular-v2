type ResumeCardProps = {
  id: string
  title: string
  status: string
  selectedTemplate: string
  updatedAt: string
  onOpen: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

export function ResumeCard({
  id,
  title,
  status,
  selectedTemplate,
  updatedAt,
  onOpen,
  onDuplicate,
  onDelete,
}: ResumeCardProps) {
  return (
    <article
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "18px",
        padding: "18px",
        background: "#ffffff",
        boxShadow: "0 10px 28px rgba(15,23,42,.05)",
      }}
    >
      <div>
        <p
          style={{
            color: "#2563eb",
            fontSize: "12px",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {selectedTemplate} Template
        </p>

        <h3
          style={{
            marginTop: "6px",
            fontSize: "20px",
            fontWeight: 900,
            color: "#0f172a",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            marginTop: "6px",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          Status: {status} • Updated {updatedAt}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginTop: "16px",
        }}
      >
        <button
          type="button"
          onClick={() => onOpen(id)}
          style={primaryButton}
        >
          Open
        </button>

        <button
          type="button"
          onClick={() => onDuplicate(id)}
          style={secondaryButton}
        >
          Duplicate
        </button>

        <button
          type="button"
          onClick={() => onDelete(id)}
          style={dangerButton}
        >
          Delete
        </button>
      </div>
    </article>
  )
}

const primaryButton = {
  border: "0",
  borderRadius: "12px",
  padding: "10px 14px",
  background: "#2563eb",
  color: "#ffffff",
  fontWeight: 800,
  cursor: "pointer",
}

const secondaryButton = {
  border: "1px solid #cbd5e1",
  borderRadius: "12px",
  padding: "10px 14px",
  background: "#ffffff",
  color: "#334155",
  fontWeight: 800,
  cursor: "pointer",
}

const dangerButton = {
  border: "1px solid #fecaca",
  borderRadius: "12px",
  padding: "10px 14px",
  background: "#fff1f2",
  color: "#dc2626",
  fontWeight: 800,
  cursor: "pointer",
}