"use client"

import { useState } from "react"

type ResumeActionBarProps = {
  title: string
  status: string
  hasUnsavedChanges: boolean
  onSaveLocal: () => void
  onClearLocal: () => void
  onSaveServer: () => void
  onLoadServer: () => void
  onExport: () => void
}

export function ResumeActionBar({
  title,
  status,
  hasUnsavedChanges,
  onSaveLocal,
  onClearLocal,
  onSaveServer,
  onLoadServer,
  onExport,
}: ResumeActionBarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <section
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "18px",
        padding: "12px 16px",
        background:
          "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
        boxShadow: "0 8px 22px rgba(15,23,42,.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              color: "#2563eb",
              fontWeight: 900,
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Resume Workspace
          </p>

          <h1
            style={{
              marginTop: "3px",
              fontSize: "22px",
              fontWeight: 900,
              color: "#0f172a",
            }}
          >
            {title}
          </h1>

          <p
            style={{
              marginTop: "4px",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Status:{" "}
            <strong
              style={{
                color: hasUnsavedChanges
                  ? "#92400e"
                  : "#166534",
              }}
            >
              {hasUnsavedChanges
                ? "Unsaved Changes"
                : status}
            </strong>
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={onExport}
            style={{
              border: "0",
              borderRadius: "999px",
              padding: "10px 18px",
              background: "#2563eb",
              color: "#ffffff",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow:
                "0 6px 16px rgba(37,99,235,.20)",
            }}
          >
            Export Resume
          </button>

          <div
            style={{
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={() =>
                setMenuOpen((current) => !current)
              }
              style={{
                border: "1px solid #bfdbfe",
                borderRadius: "999px",
                padding: "10px 16px",
                background: "#eff6ff",
                color: "#1d4ed8",
                fontWeight: 850,
                cursor: "pointer",
                minWidth: "165px",
              }}
            >
              Actions ▾
            </button>

            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "115%",
                  width: "230px",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "14px",
                  boxShadow:
                    "0 14px 34px rgba(15,23,42,.14)",
                  overflow: "hidden",
                  zIndex: 100,
                }}
              >
                <DropdownButton
                  label="Save Local Draft"
                  helper="Save in this browser"
                  onClick={() => {
                    onSaveLocal()
                    setMenuOpen(false)
                  }}
                />

                <DropdownButton
                  label="Save to Supabase"
                  helper="Save to your account"
                  onClick={() => {
                    onSaveServer()
                    setMenuOpen(false)
                  }}
                />

                <DropdownButton
                  label="Load from Supabase"
                  helper="Restore saved version"
                  onClick={() => {
                    onLoadServer()
                    setMenuOpen(false)
                  }}
                />

                <DropdownButton
                  danger
                  label="Clear Draft"
                  helper="Reset local editor"
                  onClick={() => {
                    onClearLocal()
                    setMenuOpen(false)
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

type DropdownButtonProps = {
  label: string
  helper: string
  onClick: () => void
  danger?: boolean
}

function DropdownButton({
  label,
  helper,
  onClick,
  danger = false,
}: DropdownButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "12px 14px",
        border: "none",
        borderBottom: "1px solid #f1f5f9",
        background: "#ffffff",
        cursor: "pointer",
      }}
    >
      <span
        style={{
          display: "block",
          color: danger
            ? "#dc2626"
            : "#0f172a",
          fontWeight: 800,
        }}
      >
        {label}
      </span>

      <span
        style={{
          display: "block",
          marginTop: "2px",
          color: "#64748b",
          fontSize: "12px",
        }}
      >
        {helper}
      </span>
    </button>
  )
}