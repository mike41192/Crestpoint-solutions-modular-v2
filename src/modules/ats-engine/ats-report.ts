import type { ResumeBuilderFormData } from "@/modules/resume-builder"
import type { ATSResult } from "./types"
import { calculateATSScore } from "./ats-score"

export function generateATSReport(
  data: ResumeBuilderFormData
): ATSResult {
  return calculateATSScore(data)
}
