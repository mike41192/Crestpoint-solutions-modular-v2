type ResumeWorkspaceShellProps = {
  header: React.ReactNode
  editor: React.ReactNode
  preview: React.ReactNode
}

export function ResumeWorkspaceShell({
  header,
  editor,
  preview,
}: ResumeWorkspaceShellProps) {
  return (
    <div
      style={{
        display: "grid",
        gap: "16px",
      }}
    >
      {header}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(420px, 1.15fr) minmax(420px, 0.85fr)",
          gap: "20px",
          alignItems: "start",
        }}
      >
        <main
          style={{
            display: "grid",
            gap: "16px",
            minWidth: 0,
          }}
        >
          {editor}
        </main>

        <aside
          style={{
            position: "sticky",
            top: "16px",
            alignSelf: "start",
            minWidth: 0,
          }}
        >
          {preview}
        </aside>
      </div>
    </div>
  )
}
