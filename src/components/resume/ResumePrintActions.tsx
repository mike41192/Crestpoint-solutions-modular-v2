"use client"

export function ResumePrintActions() {
  function printResume() {
    window.print()
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        marginBottom: "16px",
      }}
    >
      <button
        type="button"
        onClick={printResume}
        style={{
          border: "0",
          borderRadius: "12px",
          padding: "12px 16px",
          background: "#2563eb",
          color: "#ffffff",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Print Resume
      </button>

      <p style={{ color: "#64748b", alignSelf: "center" }}>
        Use your browser print dialog to save as PDF for now.
      </p>
    </div>
  )
}
