"use client"

import { useState } from "react"
import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import { ResumeEditorPreview } from "@/components/resume/ResumeEditorPreview"

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