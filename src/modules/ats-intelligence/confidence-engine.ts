// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.7.13
// =====================================================

import { detectExperienceMatches } from "./experience-detector"
import { phraseTaxonomy } from "./phrase-taxonomy"
import type { DetectedSkill, SkillConfidenceResult } from "./types"

// =====================================================
// BLOCK: Related Skill Evidence Map
// Purpose:
// Gives fair partial credit when the resume shows related evidence.
// This prevents exact-phrase-only scoring from marking valid maintenance
// experience as missing.
// =====================================================

const RELATED_SKILL_EVIDENCE: Record<string, string[]> = {
  "mechanical maintenance": [
    "maintenance",
    "equipment maintenance",
    "preventive maintenance",
    "corrective maintenance",
    "maintenance technician",
    "maintenance supervisor",
    "maintenance operations",
    "production equipment",
    "mechanical systems",
  ],

  "industrial maintenance": [
    "maintenance",
    "equipment maintenance",
    "preventive maintenance",
    "manufacturing maintenance",
    "maintenance technician",
    "maintenance supervisor",
    "maintenance operations",
    "production equipment",
  ],

  "facility maintenance": [
    "maintenance",
    "equipment maintenance",
    "preventive maintenance",
    "facility operations",
    "maintenance operations",
  ],

  "equipment troubleshooting": [
    "troubleshooting",
    "equipment repair",
    "equipment failures",
    "root cause analysis",
    "resolved operational issues",
    "maintenance troubleshooting",
  ],

  "electrical troubleshooting": [
    "electrical",
    "troubleshooting",
    "equipment troubleshooting",
    "equipment repair",
    "maintenance troubleshooting",
  ],

  "team leadership": [
    "supervisor",
    "supervision",
    "managed a team",
    "led a team",
    "team leadership",
    "training",
    "scheduling",
  ],

  supervision: [
    "supervisor",
    "supervision",
    "supervisory",
    "managed a team",
    "led a team",
  ],

  "staff training": [
    "training",
    "employee training",
    "trained",
    "coached",
    "onboarding",
  ],

  scheduling: [
    "schedule",
    "scheduling",
    "planned work",
    "coordinated work",
  ],

  "continuous improvement": [
    "process improvement",
    "workflow efficiency",
    "improving efficiency",
    "operational improvement",
    "production improvement",
  ],

  "lean manufacturing": [
    "lean",
    "six sigma",
    "lean six sigma",
    "process improvement",
    "continuous improvement",
  ],

  "inventory management": [
    "inventory",
    "inventory control",
    "parts inventory",
    "stock",
    "supplies",
    "vendor management",
  ],

  "safety compliance": [
    "safety",
    "workplace safety",
    "osha",
    "osha 30",
    "compliance",
    "lockout tagout",
    "loto",
  ],

  "work orders": [
    "work order",
    "work orders",
    "cmms",
    "maintenance documentation",
  ],
}

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

function includesPhrase({
  text,
  phrase,
}: {
  text: string
  phrase: string
}): boolean {
  const normalizedText = normalizeText(text)
  const normalizedPhrase = normalizeText(phrase)

  if (!normalizedPhrase) {
    return false
  }

  const pattern = new RegExp(
    `(^|\\s)${normalizedPhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`,
    "i",
  )

  return pattern.test(normalizedText)
}

function getRelatedEvidenceTerms(skill: string): string[] {
  const normalizedSkill = normalizeText(skill)

  return Array.from(
    new Set([
      normalizedSkill,
      ...(RELATED_SKILL_EVIDENCE[normalizedSkill] || []),
    ].map(normalizeText)),
  )
}

function countKeywordMatches(skill: string, text: string): number {
  const relatedTerms = getRelatedEvidenceTerms(skill)

  return relatedTerms.some((term) =>
    includesPhrase({
      text,
      phrase: term,
    }),
  )
    ? 1
    : 0
}

function countPhraseMatches(skill: string, text: string): number {
  const normalizedText = normalizeText(text)
  const normalizedSkill = normalizeText(skill)

  const directMapping = phraseTaxonomy.find((item) => {
    return normalizeText(item.skill) === normalizedSkill
  })

  const taxonomyPhrases = directMapping?.phrases || []
  const relatedTerms = getRelatedEvidenceTerms(skill)

  const allPhrases = Array.from(
    new Set([...taxonomyPhrases, ...relatedTerms].map(normalizeText)),
  )

  return allPhrases.filter((phrase) => {
    return normalizedText.includes(phrase)
  }).length
}

function countExperienceMatches({
  skill,
  text,
}: {
  skill: string
  text: string
}): number {
  const experienceMatches = detectExperienceMatches(text)
  const relatedTerms = getRelatedEvidenceTerms(skill)

  return experienceMatches.filter((match) => {
    const normalizedMatchedSkill = normalizeText(match.skill)

    return relatedTerms.includes(normalizedMatchedSkill)
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
  const keywordScore = keywordMatches * 35
  const phraseScore = Math.min(phraseMatches, 3) * 20
  const experienceScore = Math.min(experienceMatches, 2) * 30

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

  return normalizedTargetSkills.map((skill) => {
    const keywordMatches = countKeywordMatches(skill, text)
    const phraseMatches = countPhraseMatches(skill, text)
    const experienceMatches = countExperienceMatches({
      skill,
      text,
    })

    return {
      skill,
      score: calculateScore({
        keywordMatches,
        phraseMatches,
        experienceMatches,
      }),
      keywordMatches,
      phraseMatches,
      experienceMatches,
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
