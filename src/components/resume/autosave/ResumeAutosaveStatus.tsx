type ResumeAutosaveStatusProps = {
  status: "idle" | "unsaved" | "saving" | "saved" | "error"
  lastSavedAt?: Date | null
  message?: string
}

function formatLastSaved(value?: Date | null) {
  if (!value) {
    return "Not saved yet"
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(value)
}

function getStatusStyles(status: ResumeAutosaveStatusProps["status"]) {
  if (status === "saving") {
    return {
      border: "1px solid #bfdbfe",
      background: "#eff6ff",
      color: "#1d4ed8",
      label: "Saving...",
    }
  }

  if (status === "saved") {
    return {
      border: "1px solid #bbf7d0",
      background: "#f0fdf4",
      color: "#166534",
      label: "Saved",
    }
  }

  if (status === "error") {
    return {
      border: "1px solid #fecaca",
      background: "#fff1f2",
      color: "#991b1b",
      label: "Autosave error",
    }
  }

  if (status === "unsaved") {
    return {
      border: "1px solid #fde68a",
      background: "#fffbeb",
      color: "#92400e",
      label: "Unsaved changes",
    }
  }

  return {
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    color: "#475569",
    label: "Autosave ready",
  }
}

export function ResumeAutosaveStatus({
  status,
  lastSavedAt,
  message,
}: ResumeAutosaveStatusProps) {
  const styles = getStatusStyles(status)

  return (
    <div
      style={{
        border: styles.border,
        borderRadius: "14px",
        padding: "12px 14px",
        background: styles.background,
        color: styles.color,
      }}
    >
      <strong>{styles.label}</strong>

      <p
        style={{
          marginTop: "4px",
          fontSize: "13px",
          lineHeight: 1.5,
        }}
      >
        {message || `Last saved: ${formatLastSaved(lastSavedAt)}`}
      </p>
    </div>
  )
}