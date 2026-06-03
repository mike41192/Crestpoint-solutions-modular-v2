import type { ResumeExperienceItem } from "../types"
import { classifyLine } from "./line-classifier"
import { shouldMergeBullet } from "./bullet-detector"
import {
  looksLikeDateRange,
  looksLikeLocation,
} from "./date-location-detector"

// =====================================================
// BLOCK: Local Types
// =====================================================

type JobDraft = ResumeExperienceItem

// =====================================================
// BLOCK: Text Helpers
// =====================================================

function cleanLine(line: string) {
  return line.replace(/^[-•*]\s*/, "").replace(/\s+/g, " ").trim()
}

function cleanLines(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\u2022/g, "\n• ")
    .split("\n")
    .map((line) => cleanLine(line))
    .filter(Boolean)
}

// =====================================================
// BLOCK: Job Helpers
// =====================================================

function createJob(index: number): JobDraft {
  return {
    id: `experience-${index}`,
    role: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    bullets: [],
  }
}

function splitRoleCompany(line: string) {
  const separators = [" — ", " – ", " - ", " | ", " at "]

  for (const separator of separators) {
    if (line.includes(separator)) {
      const [role, ...companyParts] = line.split(separator)

      return {
        role: role.trim(),
        company: companyParts.join(separator).trim(),
      }
    }
  }

  return {
    role: line.trim(),
    company: "",
  }
}

function splitCompanyLocation(line: string) {
  const separators = [" — ", " – ", " - ", " | "]

  for (const separator of separators) {
    if (line.includes(separator)) {
      const [company, ...locationParts] = line.split(separator)

      return {
        company: company.trim(),
        location: locationParts.join(separator).trim(),
      }
    }
  }

  return {
    company: line,
    location: "",
  }
}

function splitDateRange(line: string) {
  const normalized = line.replace(/[–—]/g, "-")
  const parts = normalized
    .split("-")
    .map((part) => part.trim())
    .filter(Boolean)

  return {
    startDate: parts[0] || normalized,
    endDate: parts.slice(1).join(" - ") || "",
  }
}

function hasJobContent(job: JobDraft | null) {
  if (!job) return false

  return Boolean(
    job.role.trim() ||
      job.company.trim() ||
      job.location.trim() ||
      job.startDate.trim() ||
      job.endDate.trim() ||
      job.bullets.some((bullet) => bullet.trim()),
  )
}

function finalizeJobs(jobs: JobDraft[]) {
  return jobs
    .filter((job) => hasJobContent(job))
    .map((job, index) => ({
      ...job,
      id: `experience-${index + 1}`,
      bullets: job.bullets.length > 0 ? job.bullets : [""],
    }))
}

function appendBullet(job: JobDraft, line: string) {
  const lastIndex = job.bullets.length - 1

  if (lastIndex >= 0 && shouldMergeBullet(line)) {
    job.bullets[lastIndex] = `${job.bullets[lastIndex]} ${line}`.trim()
    return
  }

  job.bullets.push(line)
}

// =====================================================
// BLOCK: Main Taxonomy Experience Parser
// =====================================================

export function parseExperienceWithTaxonomy(
  text: string,
): ResumeExperienceItem[] {
  const lines = cleanLines(text)
  const jobs: JobDraft[] = []

  let currentJob: JobDraft | null = null

  function startJob(roleLine: string) {
    if (hasJobContent(currentJob)) {
      jobs.push(currentJob as JobDraft)
    }

    const parsedHeader = splitRoleCompany(roleLine)

    currentJob = createJob(jobs.length + 1)
    currentJob.role = parsedHeader.role
    currentJob.company = parsedHeader.company
  }

  function ensureJob() {
    if (!currentJob) {
      currentJob = createJob(jobs.length + 1)
    }

    return currentJob
  }

  lines.forEach((line) => {
    const classified = classifyLine(line)

    if (classified.type === "job_title" && classified.confidence >= 30) {
      startJob(line)
      return
    }

    const job = ensureJob()

    if (classified.type === "company" && !job.company) {
      const parsedCompany = splitCompanyLocation(line)

      job.company = parsedCompany.company

      if (parsedCompany.location && !job.location) {
        job.location = parsedCompany.location
      }

      return
    }

    if (looksLikeLocation(line) && !job.location) {
      job.location = line
      return
    }

    if (looksLikeDateRange(line)) {
      const dates = splitDateRange(line)

      if (!job.startDate) job.startDate = dates.startDate
      if (!job.endDate) job.endDate = dates.endDate

      return
    }

    if (classified.type === "bullet" || classified.type === "unknown") {
      appendBullet(job, line)
    }
  })

  if (hasJobContent(currentJob)) {
    jobs.push(currentJob as JobDraft)
  }

  return finalizeJobs(jobs)
}