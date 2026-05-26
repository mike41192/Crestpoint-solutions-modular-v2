import type { ResumeBuilderFormData } from "@/modules/resume-builder"

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
  return (
    <form style={{ display: "grid", gap: "16px" }}>
      <div>
        <label style={labelStyle}>
          Full Name
          <input
            style={inputStyle}
            defaultValue={data.contact.fullName}
            placeholder="Jane Doe"
          />
        </label>
      </div>

      <div>
        <label style={labelStyle}>
          Email
          <input
            style={inputStyle}
            defaultValue={data.contact.email}
            placeholder="jane@email.com"
          />
        </label>
      </div>

      <div>
        <label style={labelStyle}>
          Phone
          <input
            style={inputStyle}
            defaultValue={data.contact.phone}
            placeholder="555-555-5555"
          />
        </label>
      </div>

      <div>
        <label style={labelStyle}>
          Location
          <input
            style={inputStyle}
            defaultValue={data.contact.location}
            placeholder="Chicago, IL"
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
            defaultValue={data.summary}
            placeholder="Write a short professional summary..."
          />
        </label>
      </div>

      <div>
        <label style={labelStyle}>
          Skills
          <input
            style={inputStyle}
            defaultValue={data.skills.join(", ")}
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
  )
}