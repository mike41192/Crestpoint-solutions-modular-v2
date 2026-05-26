import type { ResumeEducationItem } from "@/modules/resume-builder"
import { inputStyle, labelStyle } from "./sharedStyles"

type EducationSectionProps = {
  education: ResumeEducationItem[]
  onFieldChange: (
    id: string,
    field: keyof Omit<ResumeEducationItem, "id">,
    value: string
  ) => void
  onAddEducation: () => void
  onRemoveEducation: (id: string) => void
}

export function EducationSection({
  education,
  onFieldChange,
  onAddEducation,
  onRemoveEducation,
}: EducationSectionProps) {
  return (
    <div>
      <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Education</h3>

      <div style={{ marginTop: "12px", display: "grid", gap: "16px" }}>
        {education.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "14px",
            }}
          >
            {[
              ["School", "school", "University or School Name"],
              ["Degree", "degree", "Bachelor's, Associate, Certification"],
              ["Field of Study", "field", "Business, IT, Healthcare"],
              ["Graduation Date", "graduationDate", "May 2024"],
            ].map(([label, field, placeholder]) => (
              <div
                key={field}
                style={{ marginTop: field === "school" ? 0 : "12px" }}
              >
                <label style={labelStyle}>
                  {label}
                  <input
                    style={inputStyle}
                    value={item[field as keyof Omit<ResumeEducationItem, "id">] || ""}
                    onChange={(event) =>
                      onFieldChange(
                        item.id,
                        field as keyof Omit<ResumeEducationItem, "id">,
                        event.target.value
                      )
                    }
                    placeholder={placeholder}
                  />
                </label>
              </div>
            ))}

            <button
              type="button"
              onClick={() => onRemoveEducation(item.id)}
              style={{
                marginTop: "12px",
                border: "1px solid #fecaca",
                borderRadius: "12px",
                padding: "10px 14px",
                background: "#fff1f2",
                color: "#991b1b",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Remove Education
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAddEducation}
        style={{
          marginTop: "12px",
          border: "1px solid #cbd5e1",
          borderRadius: "12px",
          padding: "10px 14px",
          background: "#ffffff",
          color: "#334155",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Add Education
      </button>
    </div>
  )
}