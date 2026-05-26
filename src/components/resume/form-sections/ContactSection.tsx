import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import { inputStyle, labelStyle } from "./sharedStyles"

type ContactSectionProps = {
  contact: ResumeBuilderFormData["contact"]
  onChange: (
    field: keyof ResumeBuilderFormData["contact"],
    value: string
  ) => void
}

export function ContactSection({ contact, onChange }: ContactSectionProps) {
  return (
    <>
      {[
        ["Full Name", "fullName", "Jane Doe"],
        ["Email", "email", "jane@email.com"],
        ["Phone", "phone", "555-555-5555"],
        ["Location", "location", "Chicago, IL"],
        ["LinkedIn", "linkedIn", "https://linkedin.com/in/yourname"],
        ["Website", "website", "https://yourwebsite.com"],
      ].map(([label, field, placeholder]) => (
        <div key={field}>
          <label style={labelStyle}>
            {label}
            <input
              style={inputStyle}
              value={contact[field as keyof typeof contact] || ""}
              onChange={(event) =>
                onChange(
                  field as keyof ResumeBuilderFormData["contact"],
                  event.target.value
                )
              }
              placeholder={placeholder}
            />
          </label>
        </div>
      ))}
    </>
  )
}