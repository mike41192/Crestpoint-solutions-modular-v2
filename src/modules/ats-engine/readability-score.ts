// =====================================================
// BLOCK: Type Imports
// =====================================================

import type { ResumeBuilderFormData } from "@/modules/resume-builder"

// =====================================================
// BLOCK: Resume Text Builder
// =====================================================

function getResumeText(data: ResumeBuilderFormData) {
  return [
    data.summary,
    ...data.skills,
    ...data.certifications,
    ...data.experience.flatMap((job) => [
      job.company,
      job.role,
      ...job.bullets,
    ]),
    ...data.education.flatMap((education) => [
      education.school,
      education.degree,
      education.field,
    ]),
  ]
    .filter(Boolean)
    .join(" ")
}

// =====================================================
// BLOCK: Text Metrics
// =====================================================

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function countSentences(text: string) {
  return text
    .split(/[.!?]/)
    .map((sentence) => sentence.trim())
    .filter(Boolean).length
}

function countLongSentences(text: string) {
  return text
    .split(/[.!?]/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => countWords(sentence) > 28).length
}

function countVeryLongBullets(data: ResumeBuilderFormData) {
  return data.experience
    .flatMap((job) => job.bullets || [])
    .filter(Boolean)
    .filter((bullet) => countWords(bullet) > 35).length
}

function clampScore(score: number) {
  return Math.min(Math.max(score, 0), 100)
}

// =====================================================
// BLOCK: Public Readability Score
// =====================================================

export function calculateReadabilityScore(data: ResumeBuilderFormData) {
  const text = getResumeText(data)
  const wordCount = countWords(text)
  const sentenceCount = countSentences(text)
  const longSentenceCount = countLongSentences(text)
  const veryLongBulletCount = countVeryLongBullets(data)

  let score = 100

  // =====================================================
  // BLOCK: Resume Length Penalties
  // =====================================================

  if (wordCount < 120) score -= 30
  else if (wordCount < 180) score -= 15

  if (wordCount > 1100) score -= 25
  else if (wordCount > 900) score -= 15

  // =====================================================
  // BLOCK: Sentence Complexity Penalties
  // =====================================================

  if (longSentenceCount >= 10) score -= 30
  else if (longSentenceCount >= 5) score -= 20
  else if (longSentenceCount >= 2) score -= 10

  if (veryLongBulletCount >= 5) score -= 25
  else if (veryLongBulletCount >= 2) score -= 10

  // =====================================================
  // BLOCK: Structure Penalties
  // =====================================================

  if (sentenceCount === 0 && wordCount > 80) {
    score -= 15
  }

  if (data.experience.length > 0) {
    const totalBullets = data.experience.reduce((sum, job) => {
      return sum + (job.bullets?.filter(Boolean).length || 0)
    }, 0)

    if (totalBullets < 3) {
      score -= 15
    }
  }

  return clampScore(score)
}
