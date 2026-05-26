import type { ResumeBuilderFormData } from "@/modules/resume-builder"

type ResumeEditorPreviewProps = {
  data: ResumeBuilderFormData
}

export function ResumeEditorPreview({ data }: ResumeEditorPreviewProps) {
  return (
    <div style={{ display: "grid", gap: "12px" }}>
      <div>
        <strong>Name</strong>
        <p style={{ color: "#64748b" }}>
          {data.contact.fullName || "Not added yet"}
        </p>
      </div>

      <div>
        <strong>Email</strong>
        <p style={{ color: "#64748b" }}>
          {data.contact.email || "Not added yet"}
        </p>
      </div>

      <div>
        <strong>Phone</strong>
        <p style={{ color: "#64748b" }}>
          {data.contact.phone || "Not added yet"}
        </p>
      </div>

      <div>
        <strong>Location</strong>
        <p style={{ color: "#64748b" }}>
          {data.contact.location || "Not added yet"}
        </p>
      </div>

      <div>
        <strong>Professional Summary</strong>
        <p style={{ color: "#64748b" }}>
          {data.summary || "Not added yet"}
        </p>
      </div>

      <div>
        <strong>Skills</strong>
        <p style={{ color: "#64748b" }}>
          {data.skills.length > 0 ? data.skills.join(", ") : "Not added yet"}
        </p>
      </div>
    </div>
  )
}