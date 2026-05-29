"use client"

import { useState } from "react"

type ResumeCardProps = {
  id: string
  title: string
  status: string
  selectedTemplate: string
  updatedAt: string
  onOpen: (id: string) => void
  onRename: (id: string, title: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

export function ResumeCard({
  id,
  title,
  status,
  selectedTemplate,
  updatedAt,
  onOpen,
  onRename,
  onDuplicate,
  onDelete,
}: ResumeCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <article
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "18px",
        padding: "18px",
        background: "#ffffff",
        boxShadow: "0 10px 28px rgba(15,23,42,.05)",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          alignItems: "flex-start",
        }}
      >
        <div>
          <p
            style={{
              color: "#2563eb",
              fontSize: "12px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {selectedTemplate} Template
          </p>

          <h3
            style={{
              marginTop: "6px",
              fontSize: "20px",
              fontWeight: 900,
              color: "#0f172a",
            }}
          >
            {title}
          </h3>

          <p
            style={{
              marginTop: "6px",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Status: {status} • Updated {updatedAt}
          </p>
        </div>

        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "999px",
              padding: "7px 10px",
              background: "#ffffff",
              color: "#334155",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            ⋮
          </button>

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "110%",
                width: "190px",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                boxShadow: "0 14px 34px rgba(15,23,42,.14)",
                overflow: "hidden",
                zIndex: 50,
              }}
            >
              <MenuButton
                label="Rename"
                onClick={() => {
                  onRename(id, title)
                  setMenuOpen(false)
                }}
              />

              <MenuButton
                label="Duplicate"
                onClick={() => {
                  onDuplicate(id)
                  setMenuOpen(false)
                }}
              />

              <MenuButton
                danger
                label="Delete"
                onClick={() => {
                  onDelete(id)
                  setMenuOpen(false)
                }}
              />
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpen(id)}
        style={{
          marginTop: "16px",
          width: "100%",
          border: "0",
          borderRadius: "12px",
          padding: "11px 14px",
          background: "#2563eb",
          color: "#ffffff",
          fontWeight: 850,
          cursor: "pointer",
        }}
      >
        Open Resume
      </button>
    </article>
  )
}

type MenuButtonProps = {
  label: string
  onClick: () => void
  danger?: boolean
}

function MenuButton({ label, onClick, danger = false }: MenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        border: "0",
        borderBottom: "1px solid #f1f5f9",
        background: "#ffffff",
        padding: "11px 13px",
        textAlign: "left",
        color: danger ? "#dc2626" : "#334155",
        fontWeight: 750,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  )
}
