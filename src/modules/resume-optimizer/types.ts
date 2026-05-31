import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import type { ATSResult } from "@/modules/ats-engine"

export type ResumeOptimizationPriority =
  | "summary"
  | "skills"
  | "experience"
  | "keywords"
  | "formatting"

export type ResumeOptimizationSuggestion = {
  id: string
  priority: ResumeOptimizationPriority
  title: string
  currentText?: string
  suggestedText: string
  reason: string
  expectedImpact: "high" | "medium" | "low"
}

export type ResumeOptimizationInput = {
  resume: ResumeBuilderFormData
  jobDescription: string
  atsResult: ATSResult
}

export type ResumeOptimizationResult = {
  suggestions: ResumeOptimizationSuggestion[]
  estimatedScoreLift: number
  optimizedScoreEstimate: number
}
