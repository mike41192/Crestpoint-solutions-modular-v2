type ResumeLibraryToolbarProps = {
  search: string
  sort: "updated" | "title"
  totalCount: number
  onSearchChange: (value: string) => void
  onSortChange: (value: "updated" | "title") => void
}

export function ResumeLibraryToolbar({
  search,
  sort,
  totalCount,
  onSearchChange,
  onSortChange,
}: ResumeLibraryToolbarProps) {
  return (
    <section
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "14px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        gap: "14px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div>
        <strong style={{ color: "#0f172a" }}>{totalCount} resumes</strong>
        <p style={{ marginTop: "3px", color: "#64748b", fontSize: "13px" }}>
          Search and organize saved resume versions.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search resumes..."
          style={{
            minWidth: "220px",
            padding: "10px 12px",
            border: "1px solid #cbd5e1",
            borderRadius: "12px",
          }}
        />

        <select
          value={sort}
          onChange={(event) =>
            onSortChange(event.target.value as "updated" | "title")
          }
          style={{
            padding: "10px 12px",
            border: "1px solid #cbd5e1",
            borderRadius: "12px",
            background: "#ffffff",
          }}
        >
          <option value="updated">Sort by Updated</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>
    </section>
  )
}