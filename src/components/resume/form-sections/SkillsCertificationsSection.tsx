"use client"

import { useEffect, useState } from "react"
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
  const [skillsText, setSkillsText] = useState(skills.join(", "))
  const [certificationsText, setCertificationsText] = useState(
    certifications.join(", ")
  )

  useEffect(() => {
    setSkillsText(skills.join(", "))
  }, [skills])

  useEffect(() => {
    setCertificationsText(certifications.join(", "))
  }, [certifications])

  function commitSkills(value: string) {
    onSkillsChange(value)
  }

  function commitCertifications(value: string) {
    onCertificationsChange(value)
  }

  return (
    <>
      <div>
        <label style={labelStyle}>
          Certifications
          <input
            style={inputStyle}
            value={certificationsText}
            onChange={(event) => setCertificationsText(event.target.value)}
            onBlur={(event) => commitCertifications(event.target.value)}
            placeholder="PMP, CPR, Google Analytics, OSHA 30"
          />
        </label>

        <p style={{ marginTop: "6px", color: "#64748b", fontSize: "14px" }}>
          Separate certifications with commas. Changes save when you leave the
          field.
        </p>
      </div>

      <div>
        <label style={labelStyle}>
          Skills
          <input
            style={inputStyle}
            value={skillsText}
            onChange={(event) => setSkillsText(event.target.value)}
            onBlur={(event) => commitSkills(event.target.value)}
            placeholder="Leadership, Sales, Operations, Customer Service"
          />
        </label>

        <p style={{ marginTop: "6px", color: "#64748b", fontSize: "14px" }}>
          Separate skills with commas. Changes save when you leave the field.
        </p>
      </div>
    </>
  )
}