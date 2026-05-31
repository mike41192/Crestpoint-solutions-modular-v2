import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import { extractJobKeywords, normalizeKeywordText } from "./job-description-parser"

export type KeywordMatchResult = {
  matchedKeywords: string[]
  missingKeywords: string[]
  keywordMatchPercent: number
  totalKeywords: number
}

function resumeToSearchableText(data: ResumeBuilderFormData) {
  return normalizeKeywordText(
    [
      data.contact.fullName,
      data.contact.location,
      data.summary,
      ...data.skills,
      ...data.certifications,
      ...data.education.flatMap((education) => [
        education.school,
        education.degree,
        education.field,
      ]),
      ...data.experience.flatMap((job) => [
        job.company,
        job.role,
        job.location,
        ...job.bullets,
      ]),
    ]
      .filter(Boolean)
      .join(" ")
  )
}

export function matchResumeKeywords(
  data: ResumeBuilderFormData,
  jobDescription: string
): KeywordMatchResult {
  const jobKeywords = extractJobKeywords(jobDescription)
  const resumeText = resumeToSearchableText(data)

  if (!jobDescription.trim() || jobKeywords.length === 0) {
    return {
      matchedKeywords: [],
      missingKeywords: [],
      keywordMatchPercent: 0,
      totalKeywords: 0,
    }
  }

  const matchedKeywords = jobKeywords.filter((keyword) =>
    resumeText.includes(keyword)
  )

  const missingKeywords = jobKeywords.filter(
    (keyword) => !matchedKeywords.includes(keyword)
  )

  return {
    matchedKeywords,
    missingKeywords,
    keywordMatchPercent: Math.round(
      (matchedKeywords.length / jobKeywords.length) * 100
    ),
    totalKeywords: jobKeywords.length,
  }
}
