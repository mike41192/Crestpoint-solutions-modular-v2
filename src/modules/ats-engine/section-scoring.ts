// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { ResumeBuilderFormData } from "@/modules/resume-builder"

// =====================================================
// BLOCK: Helper Functions
// =====================================================

function clampScore(score: number) {
  return Math.min(Math.max(score, 0), 100)
}

function cleanList(values: string[]) {
  return values.map((value) => value.trim()).filter(Boolean)
}

function getExperienceJobs(data: ResumeBuilderFormData) {
  return (
    data.experience?.filter((job) => {
      return job.role?.trim() || job.company?.trim()
    }) || []
  )
}

function getExperienceBullets(data: ResumeBuilderFormData) {
  return getExperienceJobs(data)
    .flatMap((job) => job.bullets || [])
    .map((bullet) => bullet.trim())
    .filter(Boolean)
}

function hasQuantifiedEvidence(value: string) {
  return /\d|%|\$|hours?|days?|weeks?|months?|years?|reduced|improved|increased|saved|trained|managed|supervised/i.test(
    value,
  )
}

function hasActionVerb(value: string) {
  return /managed|led|trained|improved|reduced|increased|coordinated|maintained|repaired|inspected|implemented|developed|created|optimized|supervised|operated|resolved|supported/i.test(
    value,
  )
}

// =====================================================
// BLOCK: Contact Section Scoring
// =====================================================

export function scoreContactSection(data: ResumeBuilderFormData): number {
  let score = 0

  if (data.contact.fullName?.trim()) score += 25
  if (data.contact.email?.trim()) score += 25
  if (data.contact.phone?.trim()) score += 20
  if (data.contact.location?.trim()) score += 20
  if (data.contact.linkedIn?.trim() || data.contact.website?.trim()) score += 10

  return clampScore(score)
}

// =====================================================
// BLOCK: Summary Section Scoring
// =====================================================

export function scoreSummarySection(data: ResumeBuilderFormData): number {
  const summary = data.summary?.trim() || ""
  const summaryLength = summary.length
  const lowerSummary = summary.toLowerCase()

  if (!summary) return 0

  let score = 0

  if (summaryLength >= 250) {
    score += 45
  } else if (summaryLength >= 150) {
    score += 35
  } else if (summaryLength >= 80) {
    score += 25
  } else {
    score += 10
  }

  if (
    /manager|supervisor|technician|specialist|coordinator|operator|developer|analyst|assistant|representative/.test(
      lowerSummary,
    )
  ) {
    score += 20
  }

  if (
    /maintenance|manufacturing|operations|customer service|sales|healthcare|software|administrative|management/.test(
      lowerSummary,
    )
  ) {
    score += 20
  }

  if (hasQuantifiedEvidence(summary)) {
    score += 15
  }

  return clampScore(score)
}

// =====================================================
// BLOCK: Skills Section Scoring
// =====================================================

export function scoreSkillsSection(data: ResumeBuilderFormData): number {
  const skills = cleanList(data.skills || [])
  const certifications = cleanList(data.certifications || [])

  let score = 0

  if (skills.length >= 20) {
    score += 70
  } else if (skills.length >= 15) {
    score += 60
  } else if (skills.length >= 10) {
    score += 50
  } else if (skills.length >= 5) {
    score += 30
  } else if (skills.length > 0) {
    score += 15
  }

  if (certifications.length >= 3) {
    score += 20
  } else if (certifications.length >= 1) {
    score += 10
  }

  const skillText = skills.join(" ").toLowerCase()

  if (
    /maintenance|troubleshooting|leadership|inventory|safety|customer service|project management|excel|cmms|osha|quality/.test(
      skillText,
    )
  ) {
    score += 10
  }

  return clampScore(score)
}

// =====================================================
// BLOCK: Education Section Scoring
// =====================================================

export function scoreEducationSection(data: ResumeBuilderFormData): number {
  const educationItems = data.education || []

  if (educationItems.length === 0) return 0

  const bestEducation = educationItems[0]
  let score = 0

  if (bestEducation.school?.trim()) score += 35
  if (bestEducation.degree?.trim()) score += 35
  if (bestEducation.field?.trim()) score += 15
  if (bestEducation.graduationDate?.trim()) score += 15

  return clampScore(score)
}

// =====================================================
// BLOCK: Experience Section Scoring
// =====================================================

export function scoreExperienceSection(data: ResumeBuilderFormData): number {
  const jobs = getExperienceJobs(data)

  if (jobs.length === 0) return 0

  let score = 0

  // =====================================================
  // BLOCK: Role Coverage
  // =====================================================

  if (jobs.length >= 3) {
    score += 25
  } else if (jobs.length === 2) {
    score += 20
  } else {
    score += 15
  }

  // =====================================================
  // BLOCK: Role Details
  // =====================================================

  const detailedJobs = jobs.filter((job) => {
    return (
      job.role?.trim() &&
      job.company?.trim() &&
      (job.startDate?.trim() || job.endDate?.trim())
    )
  })

  if (detailedJobs.length >= jobs.length) {
    score += 20
  } else if (detailedJobs.length > 0) {
    score += 10
  }

  // =====================================================
  // BLOCK: Bullet Coverage
  // =====================================================

  const bullets = getExperienceBullets(data)

  if (bullets.length >= 12) {
    score += 25
  } else if (bullets.length >= 8) {
    score += 20
  } else if (bullets.length >= 5) {
    score += 15
  } else if (bullets.length >= 2) {
    score += 8
  }

  // =====================================================
  // BLOCK: Achievement / Action Quality
  // =====================================================

  const quantifiedBullets = bullets.filter(hasQuantifiedEvidence)
  const actionVerbBullets = bullets.filter(hasActionVerb)

  if (quantifiedBullets.length >= 5) {
    score += 15
  } else if (quantifiedBullets.length >= 2) {
    score += 10
  } else if (quantifiedBullets.length >= 1) {
    score += 5
  }

  if (actionVerbBullets.length >= 8) {
    score += 15
  } else if (actionVerbBullets.length >= 4) {
    score += 10
  } else if (actionVerbBullets.length >= 1) {
    score += 5
  }

  return clampScore(score)
}
