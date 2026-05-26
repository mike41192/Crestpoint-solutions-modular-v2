"use client"

import { useState } from "react"
import { ResumeEditorPreview } from "@/components/resume/ResumeEditorPreview"
import type {
  ResumeBuilderFormData,
  ResumeEducationItem,
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

  function updateCertifications(value: string) {
    setFormData((current) => ({
      ...current,
      certifications: value
        .split(",")
        .map((certification) => certification.trim())
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

  function addExperienceBullet(id: string) {
    setFormData((current) => ({
      ...current,
      experience: current.experience.map((item) =>
        item.id === id
          ? {
              ...item,
              bullets: [...item.bullets, ""],
            }
          : item
      ),
    }))
  }

  function removeExperienceBullet(id: string, index: number) {
    setFormData((current) => ({
      ...current,
      experience: current.experience.map((item) =>
        item.id === id
          ? {
              ...item,
              bullets:
                item.bullets.length > 1
                  ? item.bullets.filter((_, bulletIndex) => bulletIndex !== index)
                  : [""],
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

  function removeExperienceItem(id: string) {
    setFormData((current) => ({
      ...current,
      experience: current.experience.filter((item) => item.id !== id),
    }))
  }

  function updateEducationField(
    id: string,
    field: keyof Omit<ResumeEducationItem, "id">,
    value: string
  ) {
    setFormData((current) => ({
      ...current,
      education: current.education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }))
  }

  function addEducationItem() {
    setFormData((current) => ({
      ...current,
      education: [
        ...current.education,
        {
          id: `education-${current.education.length + 1}`,
          school: "",
          degree: "",
          field: "",
          graduationDate: "",
        },
      ],
    }))
  }

  function removeEducationItem(id: string) {
    setFormData((current) => ({
      ...current,
      education: current.education.filter((item) => item.id !== id),
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
                              updateExperienceBullet(
                                item.id,
                                bulletIndex,
                                event.target.value
                              )
                            }
                            placeholder="Improved operations efficiency by..."
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() =>
                            removeExperienceBullet(item.id, bulletIndex)
                          }
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
                    onClick={() => addExperienceBullet(item.id)}
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
                  onClick={() => removeExperienceItem(item.id)}
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
          <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Education</h3>

          <div style={{ marginTop: "12px", display: "grid", gap: "16px" }}>
            {formData.education.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "14px",
                }}
              >
                <label style={labelStyle}>
                  School
                  <input
                    style={inputStyle}
                    value={item.school}
                    onChange={(event) =>
                      updateEducationField(
                        item.id,
                        "school",
                        event.target.value
                      )
                    }
                    placeholder="University or School Name"
                  />
                </label>

                <div style={{ marginTop: "12px" }}>
                  <label style={labelStyle}>
                    Degree
                    <input
                      style={inputStyle}
                      value={item.degree}
                      onChange={(event) =>
                        updateEducationField(
                          item.id,
                          "degree",
                          event.target.value
                        )
                      }
                      placeholder="Bachelor's, Associate, Certification"
                    />
                  </label>
                </div>

                <div style={{ marginTop: "12px" }}>
                  <label style={labelStyle}>
                    Field of Study
                    <input
                      style={inputStyle}
                      value={item.field || ""}
                      onChange={(event) =>
                        updateEducationField(
                          item.id,
                          "field",
                          event.target.value
                        )
                      }
                      placeholder="Business, IT, Healthcare"
                    />
                  </label>
                </div>

                <div style={{ marginTop: "12px" }}>
                  <label style={labelStyle}>
                    Graduation Date
                    <input
                      style={inputStyle}
                      value={item.graduationDate || ""}
                      onChange={(event) =>
                        updateEducationField(
                          item.id,
                          "graduationDate",
                          event.target.value
                        )
                      }
                      placeholder="May 2024"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => removeEducationItem(item.id)}
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
            onClick={addEducationItem}
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

        <div>
          <label style={labelStyle}>
            Certifications
            <input
              style={inputStyle}
              value={formData.certifications.join(", ")}
              onChange={(event) => updateCertifications(event.target.value)}
              placeholder="PMP, CPR, Google Analytics, OSHA 30"
            />
          </label>
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
        <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Live Preview</h3>

        <div style={{ marginTop: "12px" }}>
          <ResumeEditorPreview data={formData} />
        </div>
      </div>
    </div>
  )
}