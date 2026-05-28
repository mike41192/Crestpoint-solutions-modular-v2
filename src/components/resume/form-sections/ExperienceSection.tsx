"use client"

import { RichTextEditor } from "@/components/resume/editor/RichTextEditor"
import type { ResumeExperienceItem } from "@/modules/resume-builder"
import {
  dangerButtonStyle,
  inputStyle,
  labelStyle,
  sectionCardStyle,
  toolbarButtonStyle,
} from "./sharedStyles"

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

function bulletsToHtml(bullets: string[]) {
  const safeBullets = bullets.filter(Boolean)

  if (safeBullets.length === 0) {
    return "<ul><li></li></ul>"
  }

  return `<ul>${safeBullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>`
}

function htmlToBullets(html: string) {
  if (!html.trim()) {
    return [""]
  }

  if (typeof window === "undefined") {
    return [html]
  }

  const parser = new DOMParser()
  const document = parser.parseFromString(html, "text/html")

  const listItems = Array.from(document.querySelectorAll("li"))
    .map((item) => item.textContent?.trim() || "")
    .filter(Boolean)

  if (listItems.length > 0) {
    return listItems
  }

  const paragraphs = Array.from(document.querySelectorAll("p"))
    .map((item) => item.textContent?.trim() || "")
    .filter(Boolean)

  return paragraphs.length > 0 ? paragraphs : [""]
}

export function ExperienceSection({
  experience,
  onFieldChange,
  onBulletChange,
  onAddExperience,
  onRemoveExperience,
}: ExperienceSectionProps) {
  function updateResponsibilities(id: string, html: string) {
    const bullets = htmlToBullets(html)

    bullets.forEach((bullet, index) => {
      onBulletChange(id, index, bullet)
    })
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3 style={{ fontSize: "20px", fontWeight: 800 }}>
            Work Experience
          </h3>

          <p style={{ marginTop: "4px", color: "#64748b", lineHeight: 1.5 }}>
            Add each role once, then write all responsibilities and achievements
            inside one clean document-style editor.
          </p>
        </div>

        <button type="button" onClick={onAddExperience} style={toolbarButtonStyle}>
          Add Experience
        </button>
      </div>

      <div style={{ marginTop: "16px", display: "grid", gap: "16px" }}>
        {experience.map((item, index) => (
          <div key={item.id} style={sectionCardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: "14px",
              }}
            >
              <div>
                <strong style={{ fontSize: "18px" }}>
                  Experience {index + 1}
                </strong>

                <p style={{ marginTop: "4px", color: "#64748b" }}>
                  {item.role || "Untitled role"}
                  {item.company ? ` at ${item.company}` : ""}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRemoveExperience(item.id)}
                style={dangerButtonStyle}
              >
                Remove
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gap: "12px",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              }}
            >
              <label style={labelStyle}>
                Role
                <input
                  style={inputStyle}
                  value={item.role}
                  onChange={(event) =>
                    onFieldChange(item.id, "role", event.target.value)
                  }
                  placeholder="Maintenance Technician"
                />
              </label>

              <label style={labelStyle}>
                Company
                <input
                  style={inputStyle}
                  value={item.company}
                  onChange={(event) =>
                    onFieldChange(item.id, "company", event.target.value)
                  }
                  placeholder="Company Name"
                />
              </label>

              <label style={labelStyle}>
                Location
                <input
                  style={inputStyle}
                  value={item.location || ""}
                  onChange={(event) =>
                    onFieldChange(item.id, "location", event.target.value)
                  }
                  placeholder="Chicago, IL"
                />
              </label>

              <label style={labelStyle}>
                Dates
                <input
                  style={inputStyle}
                  value={item.startDate}
                  onChange={(event) =>
                    onFieldChange(item.id, "startDate", event.target.value)
                  }
                  placeholder="Jan 2020 - Present"
                />
              </label>
            </div>

            <div style={{ marginTop: "16px" }}>
              <label style={labelStyle}>Responsibilities & Achievements</label>

              <p style={{ marginTop: "4px", marginBottom: "8px", color: "#64748b" }}>
                Use bullets in one editor instead of separate boxes.
              </p>

              <RichTextEditor
                value={bulletsToHtml(item.bullets)}
                minHeight="180px"
                placeholder="Add responsibilities, achievements, and measurable results..."
                onChange={(html) => updateResponsibilities(item.id, html)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}