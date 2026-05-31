import type { ResumeBuilderFormData } from "@/modules/resume-builder"

export function scoreContactSection(
  data: ResumeBuilderFormData
): number {
  let score = 0

  if (data.contact.fullName?.trim()) score += 25
  if (data.contact.email?.trim()) score += 25
  if (data.contact.phone?.trim()) score += 25
  if (data.contact.location?.trim()) score += 25

  return Math.min(score, 100)
}

export function scoreSummarySection(
  data: ResumeBuilderFormData
): number {
  const summaryLength =
    data.summary?.trim().length || 0

  if (summaryLength >= 300) return 100
  if (summaryLength >= 200) return 85
  if (summaryLength >= 100) return 70
  if (summaryLength >= 50) return 50

  return 0
}

export function scoreSkillsSection(
  data: ResumeBuilderFormData
): number {
  const skillCount =
    data.skills?.filter(Boolean).length || 0

  if (skillCount >= 20) return 100
  if (skillCount >= 15) return 90
  if (skillCount >= 10) return 75
  if (skillCount >= 5) return 50

  return 0
}

export function scoreEducationSection(
  data: ResumeBuilderFormData
): number {
  const educationCount =
    data.education?.length || 0

  if (educationCount === 0) return 0

  const education =
    data.education[0]

  let score = 0

  if (education.school?.trim()) score += 40
  if (education.degree?.trim()) score += 40
  if (education.graduationDate?.trim()) score += 20

  return Math.min(score, 100)
}

export function scoreExperienceSection(
  data: ResumeBuilderFormData
): number {
  const jobs =
    data.experience?.filter(
      (job) =>
        job.role?.trim() ||
        job.company?.trim()
    ) || []

  if (jobs.length === 0) {
    return 0
  }

  let score = 0

  // Number of jobs
  if (jobs.length >= 3) {
    score += 40
  } else if (jobs.length === 2) {
    score += 30
  } else {
    score += 20
  }

  // Bullet quality
  const totalBullets = jobs.reduce(
    (sum, job) =>
      sum +
      (job.bullets?.filter(Boolean).length || 0),
    0
  )

  if (totalBullets >= 10) {
    score += 30
  } else if (totalBullets >= 5) {
    score += 20
  } else {
    score += 10
  }

  // Quantified achievements
  const quantifiedBullets = jobs.flatMap(
    (job) => job.bullets || []
  ).filter((bullet) =>
    /\d|%|\$|hours?|days?|weeks?|months?|years?/i.test(
      bullet
    )
  )

  if (quantifiedBullets.length >= 5) {
    score += 30
  } else if (quantifiedBullets.length >= 2) {
    score += 20
  } else if (quantifiedBullets.length >= 1) {
    score += 10
  }

  return Math.min(score, 100)
}
