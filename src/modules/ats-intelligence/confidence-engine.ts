// =====================================================
// BLOCK: Imports
// =====================================================

import { detectExperienceMatches } from "./experience-detector"
import { phraseTaxonomy } from "./phrase-taxonomy"
import type { DetectedSkill, SkillConfidenceResult } from "./types"

// =====================================================
// BLOCK: Helpers
// =====================================================

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w\s.%+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function uniqueSkills(skills: string[]): string[] {
  return Array.from(new Set(skills.map(normalizeText))).filter(Boolean)
}

function countKeywordMatches(skill: string, text: string): number {
  const normalizedSkill = normalizeText(skill)
  const normalizedText = normalizeText(text)

  return normalizedText.includes(normalizedSkill) ? 1 : 0
}

function countPhraseMatches(skill: string, text: string): number {
  const normalizedText = normalizeText(text)

  const mapping = phraseTaxonomy.find((item) => {
    return normalizeText(item.skill) === normalizeText(skill)
  })

  if (!mapping) {
    return 0
  }

  return mapping.phrases.filter((phrase) => {
    return normalizedText.includes(normalizeText(phrase))
  }).length
}

function calculateScore({
  keywordMatches,
  phraseMatches,
  experienceMatches,
}: {
  keywordMatches: number
  phraseMatches: number
  experienceMatches: number
}): number {
  const keywordScore = keywordMatches * 40
  const phraseScore = phraseMatches * 25
  const experienceScore = experienceMatches * 35

  return Math.min(keywordScore + phraseScore + experienceScore, 100)
}

// =====================================================
// BLOCK: Public Confidence Engine
// =====================================================

export function analyzeSkillConfidence({
  text,
  targetSkills,
}: {
  text: string
  targetSkills: string[]
}): SkillConfidenceResult[] {
  const normalizedTargetSkills = uniqueSkills(targetSkills)
  const experienceMatches = detectExperienceMatches(text)

  return normalizedTargetSkills.map((skill) => {
    const keywordMatches = countKeywordMatches(skill, text)
    const phraseMatches = countPhraseMatches(skill, text)
    const matchedExperience = experienceMatches.filter((match) => {
      return normalizeText(match.skill) === normalizeText(skill)
    })

    return {
      skill,
      score: calculateScore({
        keywordMatches,
        phraseMatches,
        experienceMatches: matchedExperience.length,
      }),
      keywordMatches,
      phraseMatches,
      experienceMatches: matchedExperience.length,
    }
  })
}

export function detectSkillsFromExperience(text: string): DetectedSkill[] {
  return detectExperienceMatches(text).map((match) => {
    return {
      skill: match.skill,
      source: "experience",
      confidence: match.confidence,
      evidence: match.evidence,
    }
  })
}
