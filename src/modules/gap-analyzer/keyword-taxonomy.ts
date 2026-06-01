// =====================================================
// BLOCK: Taxonomy Imports
// =====================================================

import {
  businessSkills,
  certificationKeywords,
  experienceSignals,
  leadershipSkills,
  manufacturingSkills,
  operationsSkills,
  technicalSkills,
} from "./taxonomies"

// =====================================================
// BLOCK: Types
// =====================================================

export type KeywordCategory =
  | "technical_skill"
  | "soft_skill"
  | "tool"
  | "platform"
  | "methodology"
  | "certification"
  | "experience_signal"

export type TaxonomyMatch = {
  keyword: string
  normalized: string
  category: KeywordCategory
  matchedText: string
  confidence: "high" | "medium" | "low"
}

// =====================================================
// BLOCK: Stop Words / Generic Blocklist
// =====================================================

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "to",
  "with",
  "work",
  "team",
  "job",
  "role",
  "tasks",
  "duties",
  "responsibilities",
  "support",
  "help",
  "assist",
  "manage",
  "handled",
  "performed",
  "worked",
  "daily",
  "weekly",
  "monthly",
])

const GENERIC_BLOCKLIST = new Set([
  "strong",
  "excellent",
  "good",
  "great",
  "fast",
  "detail",
  "details",
  "organized",
  "professional",
  "reliable",
  "motivated",
  "hardworking",
  "friendly",
  "customer",
  "service",
  "business",
  "operations",
  "process",
  "processes",
  "system",
  "systems",
  "data",
  "reports",
  "reporting",
])

// =====================================================
// BLOCK: Synonym Map
// =====================================================

const SYNONYMS: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  node: "node.js",
  nextjs: "next.js",
  "next js": "next.js",
  "restful api": "rest api",
  spreadsheet: "microsoft excel",
  spreadsheets: "microsoft excel",
  excel: "microsoft excel",
  crm: "customer relationship management",
  "crm management": "customer relationship management",
  "customer relations": "customer relationship management",
  "project coordination": "project management",
  "people management": "team leadership",
  "process improvement": "root cause analysis",
  loto: "lockout tagout",
  csm: "certified scrum master",
}

// =====================================================
// BLOCK: Taxonomy Registry
// =====================================================

const TAXONOMY: Record<KeywordCategory, string[]> = {
  technical_skill: [
    ...technicalSkills,
    "api integration",
    "rest api",
    "database design",
    "dashboard development",
  ],

  soft_skill: [
    ...leadershipSkills,
    "client communication",
    "cross-functional collaboration",
    "conflict resolution",
    "stakeholder management",
  ],

  tool: [
    "microsoft excel",
    "microsoft office",
    "google sheets",
    "power bi",
    "tableau",
    "salesforce",
    "hubspot",
    "quickbooks",
    "jira",
    "notion",
    "slack",
    "figma",
    "supabase",
    "stripe",
    "vercel",
    "github",
  ],

  platform: [
    "aws",
    "azure",
    "google cloud",
    "linkedin",
    "indeed",
    "shopify",
    "wordpress",
  ],

  methodology: [
    ...operationsSkills,
    "agile",
    "scrum",
    "kanban",
    "lean six sigma",
    "root cause analysis",
    "standard operating procedures",
    "sop development",
  ],

  certification: [...certificationKeywords],

  experience_signal: [...experienceSignals],
}

// =====================================================
// BLOCK: Helpers
// =====================================================

export function normalizeAtsKeyword(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w\s.+#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function resolveSynonym(keyword: string): string {
  return SYNONYMS[keyword] ?? keyword
}

function getCategoryForKeyword(keyword: string): KeywordCategory | null {
  for (const [category, keywords] of Object.entries(TAXONOMY)) {
    if (keywords.includes(keyword)) {
      return category as KeywordCategory
    }
  }

  return null
}

function isBlockedKeyword(keyword: string): boolean {
  const normalized = normalizeAtsKeyword(keyword)

  if (!normalized) return true
  if (normalized.length < 3) return true
  if (STOP_WORDS.has(normalized)) return true
  if (GENERIC_BLOCKLIST.has(normalized)) return true

  const wordCount = normalized.split(" ").length

  if (wordCount === 1 && normalized.length < 4) {
    return true
  }

  return false
}

function buildPhrasePriorityList(): string[] {
  return Object.values(TAXONOMY)
    .flat()
    .map(normalizeAtsKeyword)
    .map(resolveSynonym)
    .filter((keyword) => !isBlockedKeyword(keyword))
    .filter((keyword, index, array) => array.indexOf(keyword) === index)
    .sort((a, b) => b.split(" ").length - a.split(" ").length || b.length - a.length)
}

// =====================================================
// BLOCK: Public Functions
// =====================================================

export function extractTaxonomyKeywords(text: string): TaxonomyMatch[] {
  const normalizedText = normalizeAtsKeyword(text)
  const matches = new Map<string, TaxonomyMatch>()

  for (const keyword of buildPhrasePriorityList()) {
    const category = getCategoryForKeyword(keyword)

    if (!category) {
      continue
    }

    const pattern = new RegExp(`(^|\\s)${escapeRegExp(keyword)}(\\s|$)`, "i")

    if (!pattern.test(normalizedText)) {
      continue
    }

    matches.set(keyword, {
      keyword,
      normalized: keyword,
      category,
      matchedText: keyword,
      confidence: keyword.includes(" ") ? "high" : "medium",
    })
  }

  return Array.from(matches.values())
}

export function filterValidAtsKeywords(keywords: string[]): string[] {
  return keywords
    .map(normalizeAtsKeyword)
    .map(resolveSynonym)
    .filter((keyword) => !isBlockedKeyword(keyword))
    .filter((keyword) => getCategoryForKeyword(keyword) !== null)
}

export function classifyKeyword(keyword: string): KeywordCategory | null {
  const normalized = resolveSynonym(normalizeAtsKeyword(keyword))

  if (isBlockedKeyword(normalized)) {
    return null
  }

  return getCategoryForKeyword(normalized)
}

export function isCertificationKeyword(keyword: string): boolean {
  return classifyKeyword(keyword) === "certification"
}

export function isExperienceSignalKeyword(keyword: string): boolean {
  return classifyKeyword(keyword) === "experience_signal"
}
