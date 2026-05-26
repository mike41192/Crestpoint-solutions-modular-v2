"use client"

import { useState } from "react"
import { ResumeEditorPreview } from "@/components/resume/ResumeEditorPreview"
import type {
  ResumeBuilderFormData,
  ResumeExperienceItem,
} from "@/modules/resume-builder"

type ResumeStarterFormProps = {
  data: ResumeBuilderFormData
}

const inputStyle = {
  width: "100%",
  marginTop: "6px",
  padding: "10px 12px",
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
}

const labelStyle = {
  display: "block",
  fontWeight: 700,
  color: "#334155",
}

export function ResumeStarterForm({ data }: ResumeStarterFormProps) {
  const [formData, setFormData] = useState<ResumeBuilderFormData>(data)

  function updateContactField(
    field: keyof ResumeBuilderFormData["contact"],
    value: string
  ) {
    setFormData((current) => ({
      ...current,
      contact: {
        ...current.contact,
        [field]: value,
      },
    }))
  }

  function updateSummary(value: string) {
    setFormData((current) => ({
      ...current,
      summary: value,
    }))
  }

  function updateSkills(value: string) {
    setFormData((current) => ({
      ...current,
      skills: value
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    }))
  }

  function updateExperienceField(
    id: string,
    field: keyof Omit<ResumeExperienceItem, "id" | "bullets">,
    value: string
  ) {
    setFormData((current) => ({
      ...current,
      experience: current.experience.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }))
  }

  function updateExperienceBullet(id: string, index: number, value: string) {
    setFormData((current) => ({
      ...current,
      experience: current.experience.map((item) =>
        item.id === id
          ? {
              ...item,
              bullets: item.bullets.map((bullet, bulletIndex) =>
                bulletIndex === index ? value : bullet
              ),
            }
          : item
      ),
    }))
  }

  function addExperienceItem() {
    setFormData((current) => ({
      ...current,
      experience: [
        ...current.experience,
        {
          id: `experience-${current.experience.length + 1}`,
          company: "",
          role: "",
          location: "",
          startDate: "",
          endDate: "",
          bullets: [""],
        },
      ],
    }))
  }

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <form style={{ display: "grid", gap: "16px" }}>
        <div>
          <label style={labelStyle}>
            Full Name
            <input
              style={inputStyle}
              value={formData.contact.fullName}
              onChange={(event) =>
                updateContactField("fullName", event.target.value)
              }
              placeholder="Jane Doe"
            />
          </label>
        </div>

        <div>
          <label style={labelStyle}>
            Email
            <input
              style={inputStyle}
              value={formData.contact.email}
              onChange={(event) =>
                updateContactField("email", event.target.value)
              }
              placeholder="jane@email.com"
            />
          </label>
        </div>

        <div>
          <label style={labelStyle}>
            Phone
            <input
              style={inputStyle}
              value={formData.contact.phone}
              onChange={(event) =>
                updateContactField("phone", event.target.value)
              }
              placeholder="555-555-5555"
            />
          </label>
        </div>

        <div>
          <label style={labelStyle}>
            Location
            <input
              style={inputStyle}
              value={formData.contact.location}
              onChange={(event) =>
                updateContactField("location", event.target.value)
              }
              placeholder="Chicago, IL"
            />
          </label>
        </div>

        <div>
          <label style={labelStyle}>
            LinkedIn
            <input
              style={inputStyle}
              value={formData.contact.linkedIn || ""}
              onChange={(event) =>
                updateContactField("linkedIn", event.target.value)
              }
              placeholder="https://linkedin.com/in/yourname"
            />
          </label>
        </div>

        <div>
          <label style={labelStyle}>
            Website
            <input
              style={inputStyle}
              value={formData.contact.website || ""}
              onChange={(event) =>
                updateContactField("website", event.target.value)
              }
              placeholder="https://yourwebsite.com"
            />
          </label>
        </div>

        <div>
          <label style={labelStyle}>
            Professional Summary
            <textarea
              style={{
                ...inputStyle,
                minHeight: "120px",
                resize: "vertical",
              }}
              value={formData.summary}
              onChange={(event) => updateSummary(event.target.value)}
              placeholder="Write a short professional summary..."
            />
          </label>
        </div>

        <div>
          <h3 style={{ fontSize: "18px", fontWeight: 700 }}>
            Work Experience
          </h3>

          <div style={{ marginTop: "12px", display: "grid", gap: "16px" }}>
            {formData.experience.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "14px",
                }}
              >
                <label style={labelStyle}>
                  Role
                  <input
                    style={inputStyle}
                    value={item.role}
                    onChange={(event) =>
                      updateExperienceField(
                        item.id,
                        "role",
                        event.target.value
                      )
                    }
                    placeholder="Operations Manager"
                  />
                </label>

                <div style={{ marginTop: "12px" }}>
                  <label style={labelStyle}>
                    Company
                    <input
                      style={inputStyle}
                      value={item.company}
                      onChange={(event) =>
                        updateExperienceField(
                          item.id,
                          "company",
                          event.target.value
                        )
                      }
                      placeholder="Company Name"
                    />
                  </label>
                </div>

                <div style={{ marginTop: "12px" }}>
                  <label style={labelStyle}>
                    Location
                    <input
                      style={inputStyle}
                      value={item.location || ""}
                      onChange={(event) =>
                        updateExperienceField(
                          item.id,
                          "location",
                          event.target.value
                        )
                      }
                      placeholder="Chicago, IL"
                    />
                  </label>
                </div>

                <div style={{ marginTop: "12px" }}>
                  <label style={labelStyle}>
                    Start Date
                    <input
                      style={inputStyle}
                      value={item.startDate}
                      onChange={(event) =>
                        updateExperienceField(
                          item.id,
                          "startDate",
                          event.target.value
                        )
                      }
                      placeholder="Jan 2020"
                    />
                  </label>
                </div>

                <div style={{ marginTop: "12px" }}>
                  <label style={labelStyle}>
                    End Date
                    <input
                      style={inputStyle}
                      value={item.endDate}
                      onChange={(event) =>
                        updateExperienceField(
                          item.id,
                          "endDate",
                          event.target.value
                        )
                      }
                      placeholder="Present"
                    />
                  </label>
                </div>

                <div style={{ marginTop: "12px" }}>
                  <label style={labelStyle}>
                    Achievement Bullet
                    <textarea
                      style={{
                        ...inputStyle,
                        minHeight: "80px",
                        resize: "vertical",
                      }}
                      value={item.bullets[0] || ""}
                      onChange={(event) =>
                        updateExperienceBullet(
                          item.id,
                          0,
                          event.target.value
                        )
                      }
                      placeholder="Improved operations efficiency by..."
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addExperienceItem}
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

        <div>
          <label style={labelStyle}>
            Skills
            <input
              style={inputStyle}
              value={formData.skills.join(", ")}
              onChange={(event) => updateSkills(event.target.value)}
              placeholder="Leadership, Sales, Operations, Customer Service"
            />
          </label>
        </div>

        <button
          type="button"
          style={{
            border: "0",
            borderRadius: "12px",
            padding: "12px 16px",
            background: "#2563eb",
            color: "#ffffff",
            fontWeight: 700,
            cursor: "not-allowed",
            opacity: 0.8,
          }}
        >
          Save Draft Coming Soon
        </button>
      </form>

      <div>
        <h3 style={{ fontSize: "18px", fontWeight: 700 }}>
          Live Preview
        </h3>

        <div style={{ marginTop: "12px" }}>
          <ResumeEditorPreview data={formData} />
        </div>
      </div>
    </div>
  )
}