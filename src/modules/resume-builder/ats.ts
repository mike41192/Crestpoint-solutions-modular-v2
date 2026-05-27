import type { ResumeBuilderFormData } from "./types"

export type ATSKeywordMatch = {
  keyword: string
  matched: boolean
}

export type ATSAnalysisResult = {
  score: number
  matchedKeywords: string[]
  missingKeywords: string[]
  keywordMatches: ATSKeywordMatch[]
  recommendations: string[]
}

const commonStopWords = new Set([
  "and",
  "or",
  "the",
  "a",
  "an",
  "to",
  "of",
  "in",
  "for",
  "with",
  "on",
  "by",
  "is",
  "are",
  "as",
  "at",
  "from",
  "this",
  "that",
  "be",
  "will",
  "you",
  "your",
  "we",
  "our",
  "their",
  "they",
  "it",
  "role",
  "job",
  "position",
  "candidate",
  "responsibilities",
  "requirements",
])

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, " ")
}

function getResumeSearchText(data: ResumeBuilderFormData) {
  return normalizeText(
    [
      data.contact.fullName,
      data.contact.location,
      data.summary,
      data.experience
        .map((item) =>
          [
            item.company,
            item.role,
            item.location,
            item.bullets.join(" "),
          ].join(" ")
        )
        .join(" "),
      data.education
        .map((item) =>
          [item.school, item.degree, item.field].join(" ")
        )
        .join(" "),
      data.skills.join(" "),
      data.certifications.join(" "),
    ].join(" ")
  )
}

export function extractATSKeywords(jobDescription: string) {
  const normalized = normalizeText(jobDescription)

  const words = normalized
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 3)
    .filter((word) => !commonStopWords.has(word))

  const frequency = new Map<string, number>()

  words.forEach((word) => {
    frequency.set(word, (frequency.get(word) || 0) + 1)
  })

  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([keyword]) => keyword)
}

export function analyzeResumeAgainstJobDescription(
  resumeData: ResumeBuilderFormData,
  jobDescription: string
): ATSAnalysisResult {
  const keywords = extractATSKeywords(jobDescription)
  const resumeText = getResumeSearchText(resumeData)

  const keywordMatches = keywords.map((keyword) => ({
    keyword,
    matched: resumeText.includes(keyword),
  }))

  const matchedKeywords = keywordMatches
    .filter((item) => item.matched)
    .map((item) => item.keyword)

  const missingKeywords = keywordMatches
    .filter((item) => !item.matched)
    .map((item) => item.keyword)

  const score =
    keywords.length === 0
      ? 0
      : Math.round((matchedKeywords.length / keywords.length) * 100)

  const recommendations: string[] = []

  if (!jobDescription.trim()) {
    recommendations.push("Paste a job description to generate an ATS match score.")
  }

  if (score < 50 && keywords.length > 0) {
    recommendations.push(
      "Your resume is missing several important keywords from the job description."
    )
  }

  if (missingKeywords.length > 0) {
    recommendations.push(
      "Add truthful missing keywords where they fit naturally in your summary, skills, or experience."
    )
  }

  if (!resumeData.summary.trim()) {
    recommendations.push(
      "Add a professional summary that aligns with the target role."
    )
  }

  if (resumeData.skills.length < 5) {
    recommendations.push(
      "Add more relevant skills to improve keyword coverage."
    )
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Your resume has strong initial keyword alignment with this job description."
    )
  }

  return {
    score,
    matchedKeywords,
    missingKeywords,
    keywordMatches,
    recommendations,
  }
}