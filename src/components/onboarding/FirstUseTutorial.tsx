"use client"

import { useState } from "react"

type FirstUseTutorialProps = {
  moduleKey: string
}

const tutorialStepsByModule: Record<
  string,
  {
    title: string
    steps: string[]
  }
> = {
  resume_builder: {
    title: "Resume Builder Guide",
    steps: [
      "Import an existing resume or start editing manually.",
      "Use Resume Health to check completion and missing fields.",
      "Paste a job description into ATS Job Match.",
      "Use AI Optimization for improvement suggestions.",
      "Choose a template in Resume Designer before exporting.",
    ],
  },
}

export function FirstUseTutorial({ moduleKey }: FirstUseTutorialProps) {
  const [open, setOpen] = useState(false)

  const tutorial = tutorialStepsByModule[moduleKey] || {
    title: "Quick Guide",
    steps: ["Use this workspace to complete the module step by step."],
  }

  return (
    <section
      style={{
        border: "1px solid #dbeafe",
        borderRadius: "16px",
        padding: "12px 14px",
        background:
          "linear-gradient(135deg, rgba(239,246,255,1) 0%, rgba(255,255,255,1) 100%)",
        boxShadow: "0 6px 18px rgba(37,99,235,0.06)",
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
          alignItems: "center",
          gap: "12px",
          cursor: "pointer",
          padding: 0,
          textAlign: "left",
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
            First-Time Help
          </p>

          <h2
            style={{
              marginTop: "3px",
              color: "#0f172a",
              fontSize: "17px",
              fontWeight: 850,
            }}
          >
            {tutorial.title}
          </h2>
        </div>

        <span
          style={{
            border: "1px solid #bfdbfe",
            borderRadius: "999px",
            padding: "6px 10px",
            background: "#ffffff",
            color: "#1d4ed8",
            fontWeight: 800,
            fontSize: "13px",
          }}
        >
          {open ? "Hide" : "Show"} Guide
        </span>
      </button>

      {open && (
        <div
          style={{
            marginTop: "12px",
            borderTop: "1px solid #dbeafe",
            paddingTop: "12px",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "8px",
            }}
          >
            {tutorial.steps.map((step, index) => (
              <div
                key={step}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                  color: "#334155",
                  fontSize: "14px",
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    minWidth: "24px",
                    height: "24px",
                    borderRadius: "999px",
                    background: "#2563eb",
                    color: "#ffffff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "12px",
                  }}
                >
                  {index + 1}
                </span>

                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
