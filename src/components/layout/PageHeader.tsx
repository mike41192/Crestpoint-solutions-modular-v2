type PageHeaderProps = {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 700 }}>{title}</h1>

      {description && (
        <p style={{ marginTop: "8px", color: "#64748b", lineHeight: 1.5 }}>
          {description}
        </p>
      )}
    </div>
  )
}