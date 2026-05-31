import type { ResumeBuilderFormData } from "@/modules/resume-builder"

export type ATSRiskFlag = {
  severity: "high" | "medium" | "low"
  title: string
  description: string
}

export function detectATSRiskFlags(data: ResumeBuilderFormData): ATSRiskFlag[] {
  const flags: ATSRiskFlag[] = []

  if (!data.contact.email?.trim()) {
    flags.push({
      severity: "high",
      title: "Missing email address",
      description:
        "ATS systems and recruiters need an email address to identify and contact the applicant.",
    })
  }

  if (!data.contact.phone?.trim()) {
    flags.push({
      severity: "medium",
      title: "Missing phone number",
      description:
        "Adding a phone number improves recruiter contact readiness.",
    })
  }

  if (!data.summary || data.summary.trim().length < 80) {
    flags.push({
      severity: "medium",
      title: "Professional summary is too short",
      description:
        "A stronger summary should include role target, experience level, core strengths, and value.",
    })
  }

  if ((data.skills || []).length < 8) {
    flags.push({
      severity: "high",
      title: "Low skills coverage",
      description:
        "ATS systems often compare skills and keywords from the resume against the job posting.",
    })
  }

  const totalBullets = data.experience.reduce(
    (sum, job) => sum + job.bullets.filter(Boolean).length,
    0
  )

  if (totalBullets < 5) {
    flags.push({
      severity: "high",
      title: "Not enough experience bullet points",
      description:
        "Add more responsibility and achievement bullets to improve resume strength.",
    })
  }

  const hasLinkedIn = Boolean(data.contact.linkedIn?.trim())

  if (!hasLinkedIn) {
    flags.push({
      severity: "low",
      title: "LinkedIn profile missing",
      description:
        "A LinkedIn URL can improve recruiter confidence and professional verification.",
    })
  }

  return flags
}
