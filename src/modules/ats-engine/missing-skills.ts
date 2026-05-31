import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import { matchResumeKeywords } from "./keyword-matcher"

export function findMissingSkills(
  data: ResumeBuilderFormData,
  jobDescription: string
): string[] {
  const result = matchResumeKeywords(data, jobDescription)

  return result.missingKeywords.slice(0, 15)
}