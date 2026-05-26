import { inputStyle, labelStyle } from "./sharedStyles"

type SkillsCertificationsSectionProps = {
  skills: string[]
  certifications: string[]
  onSkillsChange: (value: string) => void
  onCertificationsChange: (value: string) => void
}

export function SkillsCertificationsSection({
  skills,
  certifications,
  onSkillsChange,
  onCertificationsChange,
}: SkillsCertificationsSectionProps) {
  return (
    <>
      <div>
        <label style={labelStyle}>
          Certifications
          <input
            style={inputStyle}
            value={certifications.join(", ")}
            onChange={(event) => onCertificationsChange(event.target.value)}
            placeholder="PMP, CPR, Google Analytics, OSHA 30"
          />
        </label>
      </div>

      <div>
        <label style={labelStyle}>
          Skills
          <input
            style={inputStyle}
            value={skills.join(", ")}
            onChange={(event) => onSkillsChange(event.target.value)}
            placeholder="Leadership, Sales, Operations, Customer Service"
          />
        </label>
      </div>
    </>
  )
}