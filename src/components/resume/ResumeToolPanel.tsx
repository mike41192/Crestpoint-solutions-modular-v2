type ResumeToolPanelProps = {
  title: string
  description?: string
  children: React.ReactNode
}

export function ResumeToolPanel({
  title,
  description,
  children,
}: ResumeToolPanelProps) {
  return (
    <section
      style={{
        border: "1px solid rgba(226, 232, 240, 0.9)",
        borderRadius: "20px",
        background:
          "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.9) 100%)",
        padding: "18px",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div
        style={{
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: "12px",
        }}
      >
        <h2
          style={{
            fontSize: "19px",
            fontWeight: 850,
            color: "#0f172a",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>

        {description && (
          <p
            style={{
              marginTop: "6px",
              color: "#64748b",
              lineHeight: 1.5,
              fontSize: "14px",
            }}
          >
            {description}
          </p>
        )}
      </div>

      <div style={{ marginTop: "16px" }}>{children}</div>
    </section>
  )
}