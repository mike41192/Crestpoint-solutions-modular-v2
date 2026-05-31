import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import type { ATSRecommendation, ATSSectionScore } from "./types"

function findSectionScore(
  sectionScores: ATSSectionScore[],
  name: string
) {
  return (
    sectionScores.find((section) => section.name === name)?.score || 0
  )
}

export function generateATSRecommendations(
  data: ResumeBuilderFormData,
  sectionScores: ATSSectionScore[]
): ATSRecommendation[] {
  const recommendations: ATSRecommendation[] = []

  const contactScore = findSectionScore(sectionScores, "Contact Information")
  const summaryScore = findSectionScore(sectionScores, "Professional Summary")
  const skillsScore = findSectionScore(sectionScores, "Skills")
  const experienceScore = findSectionScore(sectionScores, "Work Experience")
  const educationScore = findSectionScore(sectionScores, "Education")

  if (contactScore < 100) {
    recommendations.push({
      severity: "high",
      title: "Complete your contact information",
      description:
        "Add your full name, email, phone number, and location so recruiters and ATS systems can identify you correctly.",
    })
  }

  if (summaryScore < 75) {
    recommendations.push({
      severity: "medium",
      title: "Strengthen your professional summary",
      description:
        "Write a 3-5 sentence summary that includes your target role, years of experience, strongest skills, and measurable career value.",
    })
  }

  if (skillsScore < 75) {
    recommendations.push({
      severity: "high",
      title: "Add more relevant skills",
      description:
        "Include at least 10-20 job-relevant skills. ATS systems often compare your skills section against the job posting.",
    })
  }

  if (experienceScore < 75) {
    recommendations.push({
      severity: "high",
      title: "Expand your work experience",
      description:
        "Add recent roles with clear responsibilities and achievement-focused bullet points. Include measurable results where possible.",
    })
  }

  if (educationScore < 100) {
    recommendations.push({
      severity: "low",
      title: "Review your education section",
      description:
        "Add your school, degree, field of study, or completion date if applicable.",
    })
  }

  const hasQuantifiedBullet = data.experience.some((job) =>
    job.bullets.some((bullet) => /\d|%|\$|hours?|days?|weeks?|months?|years?/i.test(bullet))
  )

  if (!hasQuantifiedBullet) {
    recommendations.push({
      severity: "medium",
      title: "Add measurable achievements",
      description:
        "Use numbers, percentages, time savings, production improvements, cost reductions, or team size to make your bullet points stronger.",
    })
  }

  return recommendations.slice(0, 8)
}
