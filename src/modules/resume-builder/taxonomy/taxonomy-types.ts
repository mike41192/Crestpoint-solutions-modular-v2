// =====================================================
// BLOCK: Line Classification Types
// =====================================================

export type LineType =
  | "job_title"
  | "company"
  | "location_date"
  | "bullet"
  | "education"
  | "skill"
  | "certification"
  | "unknown"

// =====================================================
// BLOCK: Classified Line
// =====================================================

export interface ClassifiedLine {
  text: string
  type: LineType
  confidence: number
}

// =====================================================
// BLOCK: Parsed Job Candidate
// =====================================================

export interface ParsedJobCandidate {
  role: string
  company: string
  location: string
  startDate: string
  endDate: string
  bullets: string[]
}