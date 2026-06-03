// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { ResumeBuilderFormData } from "@/modules/resume-builder"

// =====================================================
// BLOCK: Types
// =====================================================

export type ATSRiskFlag = {
  severity: "high" | "medium" | "low"
  title: string
  description: string
}

// =====================================================
// BLOCK: Resume Helpers
// =====================================================

function getAllBullets(data: ResumeBuilderFormData) {
  return data.experience.flatMap((job) => job.bullets).filter(Boolean)
}

function hasQuantifiedAchievement(data: ResumeBuilderFormData) {
  return getAllBullets(data).some((bullet) =>
    /\d|%|\$|hours?|days?|weeks?|months?|years?|reduced|improved|increased|saved/i.test(
      bullet,
    ),
  )
}

function hasRecentExperience(data: ResumeBuilderFormData) {
  return data.experience.length > 0
}

function hasEducation(data: ResumeBuilderFormData) {
  return data.education.length > 0
}

// =====================================================
// BLOCK: Public Risk Detector
// =====================================================

export function detectATSRiskFlags(
  data: ResumeBuilderFormData,
): ATSRiskFlag[] {
  const flags: ATSRiskFlag[] = []

  // =====================================================
  // BLOCK: Contact Risks
  // =====================================================

  if (!data.contact.fullName?.trim()) {
    flags.push({
      severity: "high",
      title: "Missing full name",
      description:
        "Recruiters and ATS systems may not properly identify the applicant without a name.",
    })
  }

  if (!data.contact.email?.trim()) {
    flags.push({
      severity: "high",
      title: "Missing email address",
      description:
        "An email address is required for recruiter communication and ATS matching.",
    })
  }

  if (!data.contact.phone?.trim()) {
    flags.push({
      severity: "medium",
      title: "Missing phone number",
      description:
        "A phone number improves recruiter contact readiness and response rates.",
    })
  }

  // =====================================================
  // BLOCK: Summary Risks
  // =====================================================

  if (!data.summary?.trim()) {
    flags.push({
      severity: "high",
      title: "Missing professional summary",
      description:
        "A summary helps recruiters quickly understand your experience and target role.",
    })
  } else if (data.summary.trim().length < 80) {
    flags.push({
      severity: "medium",
      title: "Professional summary is too short",
      description:
        "Expand the summary to include experience, strengths, target role, and measurable value.",
    })
  }

  // =====================================================
  // BLOCK: Skills Risks
  // =====================================================

  if ((data.skills || []).length < 8) {
    flags.push({
      severity: "high",
      title: "Low skills coverage",
      description:
        "Most ATS systems compare skills against job requirements. Expand your skills section where accurate.",
    })
  }

  // =====================================================
  // BLOCK: Experience Risks
  // =====================================================

  if (!hasRecentExperience(data)) {
    flags.push({
      severity: "high",
      title: "No work experience listed",
      description:
        "Most professional jobs require experience evidence for ATS and recruiter review.",
    })
  }

  const totalBullets = getAllBullets(data).length

  if (totalBullets < 5) {
    flags.push({
      severity: "high",
      title: "Limited experience evidence",
      description:
        "Add more work experience bullets showing responsibilities, accomplishments, tools, and results.",
    })
  }

  if (!hasQuantifiedAchievement(data)) {
    flags.push({
      severity: "medium",
      title: "No measurable achievements found",
      description:
        "Include numbers, percentages, cost savings, productivity gains, downtime reduction, or team size where possible.",
    })
  }

  // =====================================================
  // BLOCK: Education Risks
  // =====================================================

  if (!hasEducation(data)) {
    flags.push({
      severity: "low",
      title: "Education section missing",
      description:
        "Include education, certifications, training, or apprenticeships when applicable.",
    })
  }

  // =====================================================
  // BLOCK: Professional Presence Risks
  // =====================================================

  if (!data.contact.linkedIn?.trim()) {
    flags.push({
      severity: "low",
      title: "LinkedIn profile missing",
      description:
        "A LinkedIn profile can improve recruiter confidence and professional verification.",
    })
  }

  return flags.slice(0, 8)
}