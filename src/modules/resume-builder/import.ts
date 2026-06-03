import type {
  ResumeBuilderFormData,
  ResumeEducationItem,
} from "./types"
import { starterResumeData } from "./service"
import { parseExperienceWithTaxonomy } from "./taxonomy"

export type ResumeImportParseResult = {
  status: "success" | "warning" | "error"
  message: string
  parsedData: ResumeBuilderFormData
  rawText: string
  detectedSections: string[]
}

// =====================================================
// BLOCK: Section Header Rules
// =====================================================

const sectionHeaders = {
  summary: [
    "professional summary",
    "executive summary",
    "executive profile",
    "summary",
    "profile",
    "career summary",
  ],
  experience: [
    "professional experience",
    "work experience",
    "experience",
    "employment history",
    "work history",
  ],
  education: ["education", "academic background"],
  skills: [
    "skills",
    "technical skills",
    "core skills",
    "competencies",
    "leadership areas",
  ],
  certifications: [
    "certifications",
    "licenses",
    "credentials",
    "additional training",
  ],
}

const allHeaders = Object.values(sectionHeaders).flat()

// =====================================================
// BLOCK: Detection Patterns
// =====================================================

const locationPattern = /[A-Za-z\s]+,\s?[A-Z]{2}(\s\d{5})?/i

// =====================================================
// BLOCK: Text Cleanup Helpers
// =====================================================

function normalizeText(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\u2022/g, "\n• ")
    .replace(/[•]{2,}/g, "•")
    .replace(/\t/g, " ")
    .replace(/([a-z0-9])\.([A-Z])/g, "$1.\n$2")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function cleanText(text: string) {
  return normalizeText(text)
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function cleanLines(text: string) {
  return normalizeText(text)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

function cleanBullet(line: string) {
  return line.replace(/^[-•*]\s*/, "").trim()
}

function splitListText(text: string) {
  return text
    .split(/\n|,|•/)
    .map((item) => cleanBullet(item))
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter(Boolean)
}

// =====================================================
// BLOCK: Contact Detection
// =====================================================

function detectEmail(text: string) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || ""
}

function detectPhone(text: string) {
  return (
    text.match(/(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/)?.[0] ||
    ""
  )
}

function detectLinkedIn(text: string) {
  return (
    text.match(/(https?:\/\/)?(www\.)?linkedin\.com\/[^\s]+/i)?.[0] || ""
  )
}

function detectWebsite(text: string) {
  return (
    text
      .match(/https?:\/\/(?!.*linkedin\.com)[^\s]+/i)?.[0]
      ?.replace(/[),.]+$/, "") || ""
  )
}

function detectName(text: string) {
  const lines = cleanLines(text)

  return (
    lines.find((line) => {
      const lower = line.toLowerCase()

      return (
        !line.includes("@") &&
        !line.match(/\d{3}/) &&
        !lower.includes("resume") &&
        !allHeaders.some((header) => lower === header) &&
        line.length >= 3 &&
        line.length <= 60
      )
    }) || ""
  )
}

function detectLocation(text: string) {
  return cleanLines(text).find((line) => locationPattern.test(line)) || ""
}

// =====================================================
// BLOCK: Section Extraction
// =====================================================

function getSectionText(
  text: string,
  sectionNames: string[],
  nextSectionNames: string[],
) {
  const normalizedText = normalizeText(text)

  for (const sectionName of sectionNames) {
    const sectionPattern = new RegExp(
      `(^|\\n)\\s*${sectionName}\\s*:?\\s*\\n`,
      "i",
    )

    const match = normalizedText.match(sectionPattern)

    if (!match || match.index === undefined) continue

    const startIndex = match.index + match[0].length
    const afterSection = normalizedText.slice(startIndex)
    let endIndex = afterSection.length

    for (const nextSectionName of nextSectionNames) {
      const nextPattern = new RegExp(
        `(^|\\n)\\s*${nextSectionName}\\s*:?\\s*\\n`,
        "i",
      )

      const nextMatch = afterSection.match(nextPattern)

      if (nextMatch?.index !== undefined && nextMatch.index < endIndex) {
        endIndex = nextMatch.index
      }
    }

    return afterSection.slice(0, endIndex).trim()
  }

  return ""
}

// =====================================================
// BLOCK: Education Parser
// =====================================================

function parseEducation(educationText: string): ResumeEducationItem[] {
  const lines = cleanLines(educationText)

  if (lines.length === 0) {
    return starterResumeData.education
  }

  const school =
    lines.find((line) =>
      line.match(/\b(university|college|school|institute|academy)\b/i),
    ) || lines[0]

  const degree =
    lines.find((line) =>
      line.match(
        /\b(bachelor|associate|master|degree|diploma|certificate|certification|applied science|industrial technology)\b/i,
      ),
    ) || ""

  const graduationDate =
    lines.find((line) => line.match(/\b(19|20)\d{2}\b/)) || ""

  return [
    {
      id: "education-1",
      school,
      degree,
      field: "",
      graduationDate,
    },
  ]
}

// =====================================================
// BLOCK: Section Detection
// =====================================================

function detectSections(text: string) {
  const lowerText = text.toLowerCase()
  const detected: string[] = []

  Object.entries(sectionHeaders).forEach(([key, names]) => {
    if (names.some((name) => lowerText.includes(name))) {
      detected.push(key)
    }
  })

  return detected
}

// =====================================================
// BLOCK: Main Text Resume Parser
// =====================================================

export function parseTextResume(text: string): ResumeImportParseResult {
  const normalizedText = normalizeText(text)
  const detectedSections = detectSections(normalizedText)

  const summaryText = getSectionText(
    normalizedText,
    sectionHeaders.summary,
    allHeaders,
  )

  const experienceText = getSectionText(
    normalizedText,
    sectionHeaders.experience,
    allHeaders,
  )

  const educationText = getSectionText(
    normalizedText,
    sectionHeaders.education,
    allHeaders,
  )

  const skillsText = getSectionText(
    normalizedText,
    sectionHeaders.skills,
    allHeaders,
  )

  const certificationsText = getSectionText(
    normalizedText,
    sectionHeaders.certifications,
    allHeaders,
  )

  const parsedExperience = parseExperienceWithTaxonomy(experienceText)

  const parsedData: ResumeBuilderFormData = {
    ...starterResumeData,
    contact: {
      ...starterResumeData.contact,
      fullName: detectName(normalizedText),
      email: detectEmail(normalizedText),
      phone: detectPhone(normalizedText),
      location: detectLocation(normalizedText),
      linkedIn: detectLinkedIn(normalizedText),
      website: detectWebsite(normalizedText),
    },
    summary: cleanText(summaryText),
    experience:
      parsedExperience.length > 0 ? parsedExperience : starterResumeData.experience,
    education: parseEducation(educationText),
    skills: splitListText(skillsText),
    certifications: splitListText(certificationsText),
  }

  const hasUsefulData =
    parsedData.contact.fullName ||
    parsedData.contact.email ||
    parsedData.experience.some((item) => item.role || item.company) ||
    parsedData.skills.length > 0

  return {
    status: hasUsefulData ? "success" : "warning",
    message: hasUsefulData
      ? "Resume imported and structured successfully."
      : "Resume text was extracted, but limited structured data was detected.",
    parsedData,
    rawText: normalizedText,
    detectedSections,
  }
}