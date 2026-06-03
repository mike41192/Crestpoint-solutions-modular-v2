import { scoreCompany, scoreJobTitle } from "./confidence-engine"
import { isBulletLine } from "./bullet-detector"
import type { ClassifiedLine } from "./taxonomy-types"

// =====================================================
// BLOCK: Line Classifier
// =====================================================

export function classifyLine(line: string): ClassifiedLine {
  const jobScore = scoreJobTitle(line)
  const companyScore = scoreCompany(line)

  if (isBulletLine(line)) {
    return {
      text: line,
      type: "bullet",
      confidence: 100,
    }
  }

  if (jobScore >= 50) {
    return {
      text: line,
      type: "job_title",
      confidence: jobScore,
    }
  }

  if (companyScore >= 50) {
    return {
      text: line,
      type: "company",
      confidence: companyScore,
    }
  }

  return {
    text: line,
    type: "unknown",
    confidence: 0,
  }
}