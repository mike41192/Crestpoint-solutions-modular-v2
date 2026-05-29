"use client"

import { useEffect, useState } from "react"

type ResumeVersionHistoryProps = {
  resumeId: string | null
  onVersionRestored: () => void
}

type ResumeVersion = {
  id: string
  version_label: string
  selected_template: string
  created_at: string
}

function formatDateTime(value: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value))
  } catch {
    return "recently"
  }
}

export function ResumeVersionHistory({
  resumeId,
  onVersionRestored,
}: ResumeVersionHistoryProps) {
  const [versions, setVersions] = useState<ResumeVersion[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [open, setOpen] = useState(false)

  async function loadVersions() {
    if (!resumeId) {
      setMessage("Save this resume before version history is available.")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/resume/versions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeId,
        }),
      })

      const result = await response.json()

      if (result.status !== "success") {
        setMessage(result.message || "Unable to load versions.")
        setVersions([])
        return
      }

      setVersions(result.versions || [])
    } catch {
      setMessage("Version history request failed.")
    } finally {
      setLoading(false)
    }
  }

  async function restoreVersion(versionId: string) {
    const confirmed = window.confirm(
      "Restore this version? Your current resume will be replaced, but a restore snapshot will be created."
    )

    if (!confirmed) {
      return
    }

    setMessage("Restoring version...")

    try {
      const response = await fetch("/api/resume/restore-version", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          versionId,
        }),
      })

      const result = await response.json()

      if (result.status !== "success") {
        setMessage(result.message || "Restore failed.")
        return
      }

      setMessage("Version restored.")
      await loadVersions()
      onVersionRestored()
    } catch {
      setMessage("Restore version request failed.")
    }
  }

  useEffect(() => {
    if (open) {
      loadVersions()
    }
  }, [open])

  return (
    <section
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "14px",
        background: "#ffffff",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        style={{
          width: "100%",
          border: "0",
          background: "transparent",
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          alignItems: "center",
          textAlign: "left",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 900,
              color: "#0f172a",
            }}
          >
            Version History
          </h3>

          <p
            style={{
              marginTop: "4px",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            View and restore previous saved versions.
          </p>
        </div>

        <span
          style={{
            border: "1px solid #bfdbfe",
            borderRadius: "999px",
            padding: "6px 10px",
            color: "#1d4ed8",
            background: "#eff6ff",
            fontWeight: 800,
            fontSize: "13px",
          }}
        >
          {open ? "Hide" : "Show"}
        </span>
      </button>

      {open && (
        <div
          style={{
            marginTop: "14px",
            borderTop: "1px solid #e2e8f0",
            paddingTop: "14px",
            display: "grid",
            gap: "10px",
          }}
        >
          {message && (
            <p style={{ color: "#334155", fontWeight: 700 }}>{message}</p>
          )}

          {loading ? (
            <p style={{ color: "#64748b" }}>Loading versions...</p>
          ) : versions.length === 0 ? (
            <p style={{ color: "#64748b" }}>No versions found yet.</p>
          ) : (
            versions.map((version) => (
              <div
                key={version.id}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "14px",
                  padding: "12px",
                  background: "#f8fafc",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <strong style={{ color: "#0f172a" }}>
                    {version.version_label}
                  </strong>

                  <p
                    style={{
                      marginTop: "4px",
                      color: "#64748b",
                      fontSize: "13px",
                    }}
                  >
                    {formatDateTime(version.created_at)} •{" "}
                    {version.selected_template} template
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => restoreVersion(version.id)}
                  style={{
                    border: "1px solid #bfdbfe",
                    borderRadius: "12px",
                    padding: "9px 12px",
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Restore
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  )
}
