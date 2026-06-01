// =====================================================
// BLOCK: Gap Analyzer Types
// =====================================================

export type GapPriority = "high" | "medium" | "low"

export type ResumeGapItem = {
  id: string
  priority: GapPriority
  category: "skills" | "certifications" | "experience" | "keywords"
  title: string
  description: string
  suggestedAction: string
}

export type ResumeGapAnalysisResult = {
  readinessScore: number
  missingSkills: string[]
  missingCertifications: string[]
  experienceGaps: string[]
  keywordGaps: string[]
  gaps: ResumeGapItem[]
}
