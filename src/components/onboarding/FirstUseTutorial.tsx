import type { ModuleKey } from "@/types/modules"
import { tutorialContent } from "@/data/tutorial-content"

type FirstUseTutorialProps = {
  moduleKey: ModuleKey
}

export function FirstUseTutorial({ moduleKey }: FirstUseTutorialProps) {
  const tutorial = tutorialContent.find((item) => item.moduleKey === moduleKey)

  if (!tutorial) {
    return null
  }

  return (
    <section
      style={{
        border: "1px solid #dbeafe",
        borderRadius: "16px",
        padding: "20px",
        background: "#eff6ff",
        marginTop: "24px",
      }}
    >
      <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
        {tutorial.title}
      </h2>

      <p style={{ marginTop: "8px", color: "#475569", lineHeight: 1.5 }}>
        {tutorial.intro}
      </p>

      <div style={{ marginTop: "16px", display: "grid", gap: "12px" }}>
        {tutorial.steps.map((step, index) => (
          <div
            key={step.title}
            style={{
              border: "1px solid #bfdbfe",
              borderRadius: "12px",
              padding: "14px",
              background: "#ffffff",
            }}
          >
            <strong>
              Step {index + 1}: {step.title}
            </strong>

            <p style={{ marginTop: "6px", color: "#64748b", lineHeight: 1.5 }}>
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}