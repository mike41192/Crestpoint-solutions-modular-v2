import type { ResumeExperienceItem } from "@/modules/resume-builder"
import { inputStyle, labelStyle } from "./sharedStyles"

type ExperienceSectionProps = {
  experience: ResumeExperienceItem[]
  onFieldChange: (
    id: string,
    field: keyof Omit<ResumeExperienceItem, "id" | "bullets">,
    value: string
  ) => void
  onBulletChange: (id: string, index: number, value: string) => void
  onAddBullet: (id: string) => void
  onRemoveBullet: (id: string, index: number) => void
  onAddExperience: () => void
  onRemoveExperience: (id: string) => void
}

export function ExperienceSection({
  experience,
  onFieldChange,
  onBulletChange,
  onAddBullet,
  onRemoveBullet,
  onAddExperience,
  onRemoveExperience,
}: ExperienceSectionProps) {
  return (
    <div>
      <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Work Experience</h3>

      <div style={{ marginTop: "12px", display: "grid", gap: "16px" }}>
        {experience.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "14px",
            }}
          >
            {[
              ["Role", "role", "Operations Manager"],
              ["Company", "company", "Company Name"],
              ["Location", "location", "Chicago, IL"],
              ["Start Date", "startDate", "Jan 2020"],
              ["End Date", "endDate", "Present"],
            ].map(([label, field, placeholder]) => (
              <div key={field} style={{ marginTop: field === "role" ? 0 : "12px" }}>
                <label style={labelStyle}>
                  {label}
                  <input
                    style={inputStyle}
                    value={item[field as keyof Omit<ResumeExperienceItem, "id" | "bullets">] || ""}
                    onChange={(event) =>
                      onFieldChange(
                        item.id,
                        field as keyof Omit<ResumeExperienceItem, "id" | "bullets">,
                        event.target.value
                      )
                    }
                    placeholder={placeholder}
                  />
                </label>
              </div>
            ))}

            <div style={{ marginTop: "12px" }}>
              <h4 style={{ fontSize: "16px", fontWeight: 700 }}>
                Achievement Bullets
              </h4>

              <div style={{ display: "grid", gap: "10px", marginTop: "8px" }}>
                {item.bullets.map((bullet, bulletIndex) => (
                  <div key={`${item.id}-bullet-${bulletIndex}`}>
                    <label style={labelStyle}>
                      Bullet {bulletIndex + 1}
                      <textarea
                        style={{
                          ...inputStyle,
                          minHeight: "80px",
                          resize: "vertical",
                        }}
                        value={bullet}
                        onChange={(event) =>
                          onBulletChange(item.id, bulletIndex, event.target.value)
                        }
                        placeholder="Improved operations efficiency by..."
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => onRemoveBullet(item.id, bulletIndex)}
                      style={{
                        marginTop: "8px",
                        border: "1px solid #fecaca",
                        borderRadius: "12px",
                        padding: "8px 12px",
                        background: "#fff1f2",
                        color: "#991b1b",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Remove Bullet
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onAddBullet(item.id)}
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
                Add Bullet
              </button>
            </div>

            <button
              type="button"
              onClick={() => onRemoveExperience(item.id)}
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
              Remove Experience
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAddExperience}
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
        Add Experience
      </button>
    </div>
  )
}