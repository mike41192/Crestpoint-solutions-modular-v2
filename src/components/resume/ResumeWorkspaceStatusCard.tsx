type ResumeWorkspaceStatusCardProps = {
  hasUnsavedChanges: boolean
  saveMessage?: string
  serverMessage?: string
}

export function ResumeWorkspaceStatusCard({
  hasUnsavedChanges,
  saveMessage,
  serverMessage,
}: ResumeWorkspaceStatusCardProps) {
  return (
    <div
      style={{
        border: hasUnsavedChanges
          ? "1px solid #fde68a"
          : "1px solid #bbf7d0",
        borderRadius: "16px",
        padding: "14px",
        background: hasUnsavedChanges ? "#fffbeb" : "#f0fdf4",
        color: hasUnsavedChanges ? "#92400e" : "#166534",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div>
          <strong>
            {hasUnsavedChanges ? "Unsaved workspace changes" : "Workspace saved"}
          </strong>

          <p style={{ marginTop: "4px", fontSize: "14px" }}>
            {hasUnsavedChanges
              ? "Save locally or to Supabase before leaving the page."
              : "Your current resume draft is saved or unchanged."}
          </p>
        </div>

        <span
          style={{
            borderRadius: "999px",
            padding: "6px 10px",
            background: "#ffffff",
            fontSize: "12px",
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          {hasUnsavedChanges ? "Action Needed" : "Ready"}
        </span>
      </div>

      {(saveMessage || serverMessage) && (
        <div
          style={{
            marginTop: "10px",
            display: "grid",
            gap: "4px",
            color: "#334155",
          }}
        >
          {saveMessage && <p>{saveMessage}</p>}
          {serverMessage && <p>{serverMessage}</p>}
        </div>
      )}
    </div>
  )
}
