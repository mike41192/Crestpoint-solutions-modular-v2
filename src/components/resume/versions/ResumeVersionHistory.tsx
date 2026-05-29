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
        body: JSON.stringify({ resumeId }),
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

    if (!confirmed) return

    setMessage("Restoring version...")

    try {
      const response = await fetch("/api/resume/restore-version", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ versionId }),
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
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full flex-col gap-3 text-left sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0">
          <h3 className="text-lg font-black text-slate-950">
            Version History
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            View and restore previous saved versions.
          </p>
        </div>

        <span className="w-fit rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-extrabold text-blue-700">
          {open ? "Hide" : "Show"}
        </span>
      </button>

      {open && (
        <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4">
          {message && (
            <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700">
              {message}
            </p>
          )}

          {loading ? (
            <p className="text-sm text-slate-500">Loading versions...</p>
          ) : versions.length === 0 ? (
            <p className="text-sm text-slate-500">No versions found yet.</p>
          ) : (
            versions.map((version) => (
              <div
                key={version.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <strong className="block truncate text-sm font-black text-slate-950">
                    {version.version_label}
                  </strong>

                  <p className="mt-1 break-words text-xs leading-5 text-slate-500">
                    {formatDateTime(version.created_at)} •{" "}
                    {version.selected_template} template
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => restoreVersion(version.id)}
                  className="w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-extrabold text-blue-700 hover:bg-blue-100 sm:w-auto"
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
