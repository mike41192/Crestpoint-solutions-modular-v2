// =====================================================
// BLOCK: ATS Fixture Test Runner
// Crestpoint Solutions V2
// Version: 1.6.3
// =====================================================

import { generateATSReport } from "@/modules/ats-engine"
import {
  atsTestFixtures,
  type ATSTestFixture,
} from "./ats-test-fixtures"

// =====================================================
// BLOCK: Result Types
// =====================================================

export type ATSFixtureTestResult = {
  fixtureId: string
  title: string

  expectedIndustry: string
  actualIndustry: string

  expectedQuality: string
  actualScore: number
  actualGrade: string

  industryMatch: boolean

  industryReadinessScore: number
  gapCount: number

  passed: boolean
}

// =====================================================
// BLOCK: Quality Evaluation
// =====================================================

function determineQuality(score: number) {
  if (score >= 90) return "excellent"
  if (score >= 80) return "strong"
  if (score >= 65) return "moderate"
  if (score >= 45) return "weak"

  return "poor"
}

// =====================================================
// BLOCK: Single Fixture Runner
// =====================================================

export function runATSFixture(
  fixture: ATSTestFixture,
): ATSFixtureTestResult {
  const report = generateATSReport(
    fixture.resume,
    fixture.jobDescription,
  )

  const actualQuality =
    determineQuality(
      report.overallScore,
    )

  const industryMatch =
    report.detectedIndustry ===
    fixture.expectedIndustry

  const qualityMatch =
    actualQuality ===
    fixture.expectedQuality

  return {
    fixtureId: fixture.id,
    title: fixture.title,

    expectedIndustry:
      fixture.expectedIndustry,

    actualIndustry:
      report.detectedIndustry,

    expectedQuality:
      fixture.expectedQuality,

    actualScore:
      report.overallScore,

    actualGrade:
      report.grade,

    industryMatch,

    industryReadinessScore:
      report.industryReadinessScore,

    gapCount:
      report.industryGaps.length,

    passed:
      industryMatch &&
      qualityMatch,
  }
}

// =====================================================
// BLOCK: Full Suite Runner
// =====================================================

export function runAllATSFixtureTests() {
  const results =
    atsTestFixtures.map(
      runATSFixture,
    )

  const passed =
    results.filter(
      (result) =>
        result.passed,
    ).length

  const failed =
    results.length - passed

  return {
    total: results.length,
    passed,
    failed,
    passRate:
      Math.round(
        (passed /
          results.length) *
          100,
      ) || 0,

    results,
  }
}

// =====================================================
// BLOCK: Console Dev Runner
// =====================================================

export function runATSFixtureDevTest() {
  const suite =
    runAllATSFixtureTests()

  console.group(
    "ATS Fixture Test Suite",
  )

  console.table(
    suite.results.map(
      (result) => ({
        Fixture:
          result.fixtureId,

        Score:
          result.actualScore,

        Grade:
          result.actualGrade,

        Industry:
          result.actualIndustry,

        Readiness:
          result.industryReadinessScore,

        Passed:
          result.passed,
      }),
    ),
  )

  console.log(
    `Pass Rate: ${suite.passRate}%`,
  )

  console.groupEnd()

  return suite
}