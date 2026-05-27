import type { ResumeBuilderFormData } from "./types"
import { starterResumeData } from "./service"

export type ResumeImportParseResult = {
  status: "success" | "warning" | "error"
  message: string
  parsedData: ResumeBuilderFormData
  rawText: string
  detectedSections: string[]
}

function getSectionText(
  text: string,
  sectionNames: string[],
  nextSectionNames: string[]
) {
  const normalizedText = text.replace(/\r\n/g, "\n")

  for (const sectionName of sectionNames) {
    const sectionPattern = new RegExp(
      `(^|\\n)\\s*${sectionName}\\s*:?\\s*\\n`,
      "i"
    )

    const match = normalizedText.match(sectionPattern)

    if (!match || match.index === undefined) {
      continue
    }

    const startIndex = match.index + match[0].length
    const afterSection = normalizedText.slice(startIndex)

    let endIndex = afterSection.length

    for (const nextSectionName of nextSectionNames) {
      const nextPattern = new RegExp(
        `(^|\\n)\\s*${nextSectionName}\\s*:?\\s*\\n`,
        "i"
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

function splitListText(text: string) {
  return text
    .split(/\n|,|•|-/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function detectEmail(text: string) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || ""
}

function detectPhone(text: string) {
  return (
    text.match(
      /(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/
    )?.[0] || ""
  )
}

function detectLinkedIn(text: string) {
  return text.match(/https?:\/\/(www\.)?linkedin\.com\/[^\s]+/i)?.[0] || ""
}

function detectWebsite(text: string) {
  return (
    text
      .match(/https?:\/\/(?!.*linkedin\.com)[^\s]+/i)?.[0]
      ?.replace(/[),.]+$/, "") || ""
  )
}

function detectName(text: string) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  const firstUsefulLine = lines.find(
    (line) =>
      !line.includes("@") &&
      !line.match(/\d{3}/) &&
      !line.toLowerCase().includes("resume") &&
      line.length <= 80
  )

  return firstUsefulLine || ""
}

function detectLocation(text: string) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  const locationLine = lines.find((line) =>
    line.match(/[A-Za-z\s]+,\s?[A-Z]{2}/)
  )

  return locationLine || ""
}

export function parseTextResume(rawText: string): ResumeImportParseResult {
  const text = rawText.trim()

  if (!text) {
    return {
      status: "error",
      message: "No resume text was found.",
      parsedData: starterResumeData,
      rawText,
      detectedSections: [],
    }
  }

  const sectionNames = {
    summary: ["summary", "professional summary", "profile", "objective"],
    experience: ["experience", "work experience", "employment", "employment history"],
    education: ["education", "academic background"],
    skills: ["skills", "core skills", "technical skills", "competencies"],
    certifications: ["certifications", "licenses", "certificates"],
  }

  const allSectionNames = Object.values(sectionNames).flat()

  const summaryText = getSectionText(
    text,
    sectionNames.summary,
    allSectionNames
  )

  const experienceText = getSectionText(
    text,
    sectionNames.experience,
    allSectionNames
  )

  const educationText = getSectionText(
    text,
    sectionNames.education,
    allSectionNames
  )

  const skillsText = getSectionText(text, sectionNames.skills, allSectionNames)

  const certificationsText = getSectionText(
    text,
    sectionNames.certifications,
    allSectionNames
  )

  const detectedSections = [
    summaryText ? "summary" : "",
    experienceText ? "experience" : "",
    educationText ? "education" : "",
    skillsText ? "skills" : "",
    certificationsText ? "certifications" : "",
  ].filter(Boolean)

  const parsedData: ResumeBuilderFormData = {
    contact: {
      fullName: detectName(text),
      email: detectEmail(text),
      phone: detectPhone(text),
      location: detectLocation(text),
      linkedIn: detectLinkedIn(text),
      website: detectWebsite(text),
    },
    summary: summaryText,
    experience: [
      {
        id: "experience-1",
        company: "",
        role: "",
        location: "",
        startDate: "",
        endDate: "",
        bullets: experienceText
          ? splitListText(experienceText).slice(0, 8)
          : [""],
      },
    ],
    education: [
      {
        id: "education-1",
        school: educationText.split("\n")[0]?.trim() || "",
        degree: "",
        field: "",
        graduationDate: "",
      },
    ],
    skills: skillsText ? splitListText(skillsText) : [],
    certifications: certificationsText
      ? splitListText(certificationsText)
      : [],
  }

  return {
    status: detectedSections.length > 0 ? "success" : "warning",
    message:
      detectedSections.length > 0
        ? "Resume text was parsed into structured fields."
        : "Resume text was received, but no clear section headings were detected.",
    parsedData,
    rawText,
    detectedSections,
  }
}