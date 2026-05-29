"use client"

import { useEffect, useState } from "react"

type RenameResumeModalProps = {
  open: boolean
  currentTitle: string
  onClose: () => void
  onRename: (title: string) => void
}

export function RenameResumeModal({
  open,
  currentTitle,
  onClose,
  onRename,
}: RenameResumeModalProps) {
  const [title, setTitle] = useState(currentTitle)

  useEffect(() => {
    setTitle(currentTitle)
  }, [currentTitle, open])

  if (!open) {
    return null
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        zIndex: 200,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          borderRadius: "18px",
          border: "1px solid #e2e8f0",
          padding: "22px",
          boxShadow: "0 20px 50px rgba(15,23,42,.22)",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 900,
            color: "#0f172a",
          }}
        >
          Rename Resume
        </h2>

        <p
          style={{
            marginTop: "6px",
            color: "#64748b",
            lineHeight: 1.5,
          }}
        >
          Give this resume a clear name, such as the target job, company, or
          role.
        </p>

        <label
          style={{
            display: "block",
            marginTop: "18px",
            color: "#334155",
            fontWeight: 800,
          }}
        >
          Resume Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            autoFocus
            style={{
              width: "100%",
              marginTop: "8px",
              padding: "12px",
              border: "1px solid #cbd5e1",
              borderRadius: "12px",
            }}
          />
        </label>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              border: "1px solid #cbd5e1",
              borderRadius: "12px",
              padding: "10px 14px",
              background: "#ffffff",
              color: "#334155",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onRename(title)}
            disabled={!title.trim()}
            style={{
              border: 0,
              borderRadius: "12px",
              padding: "10px 14px",
              background: title.trim() ? "#2563eb" : "#94a3b8",
              color: "#ffffff",
              fontWeight: 800,
              cursor: title.trim() ? "pointer" : "not-allowed",
            }}
          >
            Rename
          </button>
        </div>
      </div>
    </div>
  )
}
