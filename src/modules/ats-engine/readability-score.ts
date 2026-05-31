import type { ResumeBuilderFormData } from "@/modules/resume-builder"

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

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function countLongSentences(text: string) {
  return text
    .split(/[.!?]/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => countWords(sentence) > 28).length
}

export function calculateReadabilityScore(data: ResumeBuilderFormData) {
  const text = getResumeText(data)
  const wordCount = countWords(text)
  const longSentenceCount = countLongSentences(text)

  let score = 100

  if (wordCount < 150) score -= 25
  if (wordCount > 900) score -= 15
  if (longSentenceCount >= 5) score -= 20
  if (longSentenceCount >= 10) score -= 35

  return Math.max(0, Math.min(score, 100))
}
