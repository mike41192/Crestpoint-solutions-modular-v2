import type {
  ResumeBuilderFormData,
  ResumeEducationItem,
  ResumeExperienceItem,
} from "./types"
import { starterResumeData } from "./service"

export type ResumeImportParseResult = {
  status: "success" | "warning" | "error"
  message: string
  parsedData: ResumeBuilderFormData
  rawText: string
  detectedSections: string[]
}

const sectionHeaders = {
  summary: ["professional summary", "summary", "profile", "career summary"],
  experience: [
    "professional experience",
    "work experience",
    "experience",
    "employment history",
    "work history",
  ],
  education: ["education", "academic background"],
  skills: ["skills", "technical skills", "core skills", "competencies"],
  certifications: ["certifications", "licenses", "credentials"],
}

const allHeaders = Object.values(sectionHeaders).flat()

const actionVerbPattern =
  /\b(achieved|administered|analyzed|assisted|built|calibrated|collaborated|completed|conducted|coordinated|created|delivered|developed|diagnosed|directed|ensured|executed|implemented|improved|installed|led|maintained|managed|monitored|operated|organized|performed|prepared|provided|reduced|repaired|responded|scheduled|served|streamlined|supported|trained|troubleshot|used|worked)\b/i

const dateRangePattern =
  /(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december|\d{4}).*(present|\d{4}|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)/i

const locationPattern = /[A-Za-z\s]+,\s?[A-Z]{2}(\s\d{5})?/i

function normalizeText(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\u2022/g, "\n• ")
    .replace(/[•]{2,}/g, "•")
    .replace(/\t/g, " ")
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

function getSectionText(
  text: string,
  sectionNames: string[],
  nextSectionNames: string[]
) {
  const normalizedText = normalizeText(text)

  for (const sectionName of sectionNames) {
    const sectionPattern = new RegExp(
      `(^|\\n)\\s*${sectionName}\\s*:?\\s*\\n`,
      "i"
    )

    const match = normalizedText.match(sectionPattern)

    if (!match || match.index === undefined) continue

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

function looksLikeDateRange(line: string) {
  return dateRangePattern.test(line)
}

function looksLikeLocation(line: string) {
  return locationPattern.test(line)
}

function looksLikeDutyLine(line: string) {
  const cleanedLine = cleanBullet(line)

  return (
    line.trim().startsWith("•") ||
    line.trim().startsWith("-") ||
    actionVerbPattern.test(cleanedLine) ||
    cleanedLine.length > 90
  )
}

function isLikelyCompany(line: string) {
  const cleanedLine = cleanBullet(line)

  if (
    !cleanedLine ||
    looksLikeDateRange(cleanedLine) ||
    looksLikeLocation(cleanedLine) ||
    looksLikeDutyLine(cleanedLine)
  ) {
    return false
  }

  return (
    cleanedLine.length <= 90 &&
    Boolean(
      cleanedLine.match(
        /\b(inc|llc|ltd|company|corporation|corp|industries|services|school|hospital|university|college|glass|maintenance|systems|solutions|group|center|department|properties|vacations|resorts|plastics|air|rivers|grede|rivian)\b/i
      )
    )
  )
}

function isLikelyRole(line: string) {
  const cleanedLine = cleanBullet(line)

  if (
    !cleanedLine ||
    looksLikeDateRange(cleanedLine) ||
    looksLikeLocation(cleanedLine) ||
    looksLikeDutyLine(cleanedLine)
  ) {
    return false
  }

  return (
    cleanedLine.length <= 90 &&
    Boolean(
      cleanedLine.match(
        /\b(manager|technician|engineer|specialist|assistant|associate|coordinator|director|supervisor|lead|operator|representative|consultant|analyst|clerk|administrator|maintenance|mechanic|electrician|plumber|handler|soldier|forklift)\b/i
      )
    )
  )
}

function extractCleanLocationAndDate(line: string) {
  const locationMatch = line.match(locationPattern)
  const location = locationMatch?.[0]?.trim() || ""

  let dateRange = line

  if (location) {
    dateRange = dateRange.replace(location, "").trim()
  }

  dateRange = dateRange
    .replace(/[•|]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^[-–—]/, "")
    .trim()

  if (!looksLikeDateRange(dateRange)) {
    dateRange = looksLikeDateRange(line) ? line.replace(location, "").trim() : ""
  }

  return { location, dateRange }
}

function hasNearbyJobEvidence(lines: string[], index: number) {
  const nearbyLines = lines.slice(index + 1, index + 5)

  return nearbyLines.some(
    (line) =>
      isLikelyCompany(line) ||
      looksLikeDateRange(line) ||
      looksLikeLocation(line)
  )
}

function createEmptyJob(idNumber: number): ResumeExperienceItem {
  return {
    id: `experience-${idNumber}`,
    company: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    bullets: [],
  }
}

function finalizeJobs(jobs: ResumeExperienceItem[]) {
  return jobs
    .filter(
      (job) =>
        job.role.trim() ||
        job.company.trim() ||
        job.location.trim() ||
        job.startDate.trim() ||
        job.bullets.some((bullet) => bullet.trim())
    )
    .map((job, index) => ({
      ...job,
      id: `experience-${index + 1}`,
      bullets: job.bullets.filter(Boolean).length > 0 ? job.bullets : [""],
    }))
}

function parseExperienceItems(experienceText: string): ResumeExperienceItem[] {
  const lines = cleanLines(experienceText)

  if (lines.length === 0) {
    return starterResumeData.experience
  }

  const jobs: ResumeExperienceItem[] = []
  let currentJob: ResumeExperienceItem | null = null
  let pendingRole = ""
  let pendingCompany = ""

  function startJob() {
    const nextJob = createEmptyJob(jobs.length + 1)

    if (pendingRole) {
      nextJob.role = pendingRole
      pendingRole = ""
    }

    if (pendingCompany) {
      nextJob.company = pendingCompany
      pendingCompany = ""
    }

    jobs.push(nextJob)
    currentJob = nextJob
  }

  function ensureJob() {
    if (!currentJob) startJob()
    return currentJob as ResumeExperienceItem
  }

  lines.forEach((rawLine, index) => {
    const line = cleanBullet(rawLine)

    if (!line) return

    const roleCandidate = isLikelyRole(line) && hasNearbyJobEvidence(lines, index)
    const companyCandidate = isLikelyCompany(line)

    if (roleCandidate) {
      const shouldStartNewJob =
        currentJob &&
        (currentJob.role ||
          currentJob.company ||
          currentJob.startDate ||
          currentJob.bullets.some(Boolean))

      if (shouldStartNewJob) currentJob = null

      pendingRole = line

      if (pendingCompany) startJob()

      return
    }

    if (companyCandidate) {
      pendingCompany = line

      if (pendingRole) {
        startJob()
        return
      }

      const job = ensureJob()

      if (!job.company) job.company = line

      return
    }

    if (looksLikeLocation(line) || looksLikeDateRange(line)) {
      const job = ensureJob()
      const parsed = extractCleanLocationAndDate(line)

      if (parsed.location && !job.location) job.location = parsed.location
      if (parsed.dateRange && !job.startDate) job.startDate = parsed.dateRange

      return
    }

    const job = ensureJob()

    if (looksLikeDutyLine(rawLine)) {
      job.bullets.push(line)
      return
    }

    if (!job.role && line.length <= 90 && hasNearbyJobEvidence(lines, index)) {
      job.role = line
      return
    }

    job.bullets.push(line)
  })

  const finalizedJobs = finalizeJobs(jobs)

  return finalizedJobs.length > 0 ? finalizedJobs : starterResumeData.experience
}

function parseEducation(educationText: string): ResumeEducationItem[] {
  const lines = cleanLines(educationText)

  if (lines.length === 0) {
    return starterResumeData.education
  }

  const school =
    lines.find((line) =>
      line.match(/\b(university|college|school|institute|academy)\b/i)
    ) || lines[0]

  const degree =
    lines.find((line) =>
      line.match(
        /\b(bachelor|associate|master|degree|diploma|certificate|certification)\b/i
      )
    ) || ""

  const graduationDate = lines.find((line) => line.match(/\b(19|20)\d{2}\b/)) || ""

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

export function parseTextResume(text: string): ResumeImportParseResult {
  const normalizedText = normalizeText(text)
  const detectedSections = detectSections(normalizedText)

  const summaryText = getSectionText(
    normalizedText,
    sectionHeaders.summary,
    allHeaders
  )

  const experienceText = getSectionText(
    normalizedText,
    sectionHeaders.experience,
    allHeaders
  )

  const educationText = getSectionText(
    normalizedText,
    sectionHeaders.education,
    allHeaders
  )

  const skillsText = getSectionText(normalizedText, sectionHeaders.skills, allHeaders)

  const certificationsText = getSectionText(
    normalizedText,
    sectionHeaders.certifications,
    allHeaders
  )

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
    experience: parseExperienceItems(experienceText),
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
