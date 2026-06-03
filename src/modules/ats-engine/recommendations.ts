// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import type { ATSRecommendation, ATSSectionScore } from "./types"

// =====================================================
// BLOCK: Constants
// =====================================================

const MAX_RECOMMENDATIONS = 8

// =====================================================
// BLOCK: Section Score Helper
// =====================================================

function findSectionScore(sectionScores: ATSSectionScore[], name: string) {
  return sectionScores.find((section) => section.name === name)?.score || 0
}

// =====================================================
// BLOCK: Resume Evidence Helpers
// =====================================================

function getAllExperienceBullets(data: ResumeBuilderFormData) {
  return data.experience.flatMap((job) => job.bullets).filter(Boolean)
}

function hasQuantifiedBullet(data: ResumeBuilderFormData) {
  return getAllExperienceBullets(data).some((bullet) =>
    /\d|%|\$|hours?|days?|weeks?|months?|years?|reduced|increased|improved|saved|trained|managed|supervised/i.test(
      bullet,
    ),
  )
}

function hasLeadershipSignal(data: ResumeBuilderFormData) {
  const text = [
    data.summary,
    ...data.skills,
    ...data.experience.flatMap((job) => [job.role, ...job.bullets]),
  ]
    .join(" ")
    .toLowerCase()

  return /supervisor|manager|leadership|team lead|trained|coached|managed|supervised|scheduled/.test(
    text,
  )
}

function hasMaintenanceSignal(data: ResumeBuilderFormData) {
  const text = [
    data.summary,
    ...data.skills,
    ...data.certifications,
    ...data.experience.flatMap((job) => [job.role, ...job.bullets]),
  ]
    .join(" ")
    .toLowerCase()

  return /maintenance|repair|equipment|preventive|troubleshooting|mechanical|electrical|cmms|work order/.test(
    text,
  )
}

// =====================================================
// BLOCK: Recommendation Helper
// =====================================================

function addRecommendation(
  recommendations: ATSRecommendation[],
  recommendation: ATSRecommendation,
) {
  const alreadyExists = recommendations.some((item) => {
    return item.title === recommendation.title
  })

  if (!alreadyExists) {
    recommendations.push(recommendation)
  }
}

// =====================================================
// BLOCK: Public Recommendation Generator
// =====================================================

export function generateATSRecommendations(
  data: ResumeBuilderFormData,
  sectionScores: ATSSectionScore[],
  missingKeywords: string[] = [],
): ATSRecommendation[] {
  const recommendations: ATSRecommendation[] = []

  const contactScore = findSectionScore(sectionScores, "Contact Information")
  const summaryScore = findSectionScore(sectionScores, "Professional Summary")
  const skillsScore = findSectionScore(sectionScores, "Skills")
  const experienceScore = findSectionScore(sectionScores, "Work Experience")
  const educationScore = findSectionScore(sectionScores, "Education")
  const achievementScore = findSectionScore(sectionScores, "Achievements")

  // =====================================================
  // BLOCK: Core Resume Section Recommendations
  // =====================================================

  if (contactScore < 100) {
    addRecommendation(recommendations, {
      severity: "high",
      title: "Complete your contact information",
      description:
        "Add your full name, email, phone number, location, and LinkedIn URL if available. This improves recruiter contact readiness and ATS identity matching.",
    })
  }

  if (summaryScore < 75) {
    addRecommendation(recommendations, {
      severity: "medium",
      title: "Strengthen your professional summary",
      description:
        "Write a 3-5 sentence summary that names your target role, years of experience, strongest job-relevant skills, and the value you bring to employers.",
    })
  }

  if (skillsScore < 75) {
    addRecommendation(recommendations, {
      severity: "high",
      title: "Expand your skills section",
      description:
        "Add job-relevant hard skills, tools, software, certifications, and methods from the posting only when they truthfully match your background.",
    })
  }

  if (experienceScore < 75) {
    addRecommendation(recommendations, {
      severity: "high",
      title: "Expand your work experience",
      description:
        "Add recent roles with clear responsibilities, tools used, equipment handled, safety practices, and achievement-focused bullet points.",
    })
  }

  if (educationScore < 100) {
    addRecommendation(recommendations, {
      severity: "low",
      title: "Review your education section",
      description:
        "Add your school, degree, field of study, completion date, or relevant training if applicable to the target role.",
    })
  }

  // =====================================================
  // BLOCK: Achievement / Evidence Recommendations
  // =====================================================

  if (!hasQuantifiedBullet(data) || achievementScore < 60) {
    addRecommendation(recommendations, {
      severity: "medium",
      title: "Add measurable achievements",
      description:
        "Use numbers, percentages, time savings, downtime reduction, production improvements, cost savings, quality improvements, or team size to strengthen your bullet points.",
    })
  }

  if (!hasLeadershipSignal(data)) {
    addRecommendation(recommendations, {
      severity: "medium",
      title: "Add leadership evidence",
      description:
        "If accurate, include examples of supervising employees, training team members, coordinating schedules, leading projects, or improving team performance.",
    })
  }

  if (!hasMaintenanceSignal(data)) {
    addRecommendation(recommendations, {
      severity: "medium",
      title: "Add maintenance-specific evidence",
      description:
        "For maintenance roles, show experience with equipment repair, preventive maintenance, troubleshooting, work orders, safety compliance, mechanical systems, or CMMS tools.",
    })
  }

  // =====================================================
  // BLOCK: Missing Keyword Recommendations
  // =====================================================

  if (missingKeywords.length > 0) {
    const strongestKeywords = missingKeywords.slice(0, 8).join(", ")

    addRecommendation(recommendations, {
      severity: "high",
      title: "Add missing job keywords naturally",
      description: `Consider adding truthful, job-relevant terms such as: ${strongestKeywords}. Use them in your summary, skills, or experience bullets only if they reflect your real experience.`,
    })
  }

  return recommendations.slice(0, MAX_RECOMMENDATIONS)
}