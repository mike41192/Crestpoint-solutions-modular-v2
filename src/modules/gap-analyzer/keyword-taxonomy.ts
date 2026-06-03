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
// Prevents generic resume/job-description words from
// being treated as ATS skills.
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
  "into",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "their",
  "this",
  "to",
  "with",
  "within",
  "across",
  "through",
  "work",
  "works",
  "working",
  "team",
  "teams",
  "job",
  "role",
  "type",
  "position",
  "candidate",
  "summary",
  "resume",
  "full-time",
  "part-time",
  "seeking",
  "looking",
  "requires",
  "required",
  "preferred",
  "responsible",
  "responsibilities",
  "tasks",
  "duties",
  "daily",
  "weekly",
  "monthly",
  "years",
  "year",
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
  "business",
  "process",
  "processes",
  "system",
  "systems",
  "data",
  "reports",
  "reporting",
  "midwest",
  "decatur",
  "lead",
  "led",
  "manage",
  "managed",
  "management",
  "support",
  "supported",
  "help",
  "helped",
  "assist",
  "assisted",
  "handled",
  "performed",
])

// =====================================================
// BLOCK: Synonym Map
// Maps common variations to canonical ATS-safe keywords.
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
  leadership: "team leadership",
  supervisor: "supervision",
  supervising: "supervision",

  loto: "lockout tagout",
  "lock out tag out": "lockout tagout",
  "lock-out tag-out": "lockout tagout",

  csm: "certified scrum master",

  "preventative maintenance": "preventive maintenance",
  "pm maintenance": "preventive maintenance",
  "maintenance planning": "preventive maintenance",
  "maintenance repairs": "corrective maintenance",

  troubleshooting: "equipment troubleshooting",
  "troubleshoot equipment": "equipment troubleshooting",
  "mechanical troubleshooting": "equipment troubleshooting",

  "root cause": "root cause analysis",
  rca: "root cause analysis",
  "root-cause analysis": "root cause analysis",

  "osha safety": "osha",
  cmms: "cmms",
  "computerized maintenance management system": "cmms",
}

// =====================================================
// BLOCK: Taxonomy Registry
// =====================================================

const TAXONOMY: Record<KeywordCategory, string[]> = {
  technical_skill: [
    ...technicalSkills,
    ...manufacturingSkills,
    "api integration",
    "rest api",
    "database design",
    "dashboard development",
    "preventive maintenance",
    "corrective maintenance",
    "equipment troubleshooting",
    "mechanical systems",
    "electrical systems",
    "hydraulic systems",
    "pneumatic systems",
    "equipment repair",
    "production equipment",
    "industrial maintenance",
  ],

  soft_skill: [
    ...businessSkills,
    ...leadershipSkills,
    "client communication",
    "cross-functional collaboration",
    "conflict resolution",
    "stakeholder management",
    "team leadership",
    "staff training",
    "employee training",
    "supervision",
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
    "cmms",
    "blueprints",
    "schematics",
    "plc",
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
    "lean manufacturing",
    "root cause analysis",
    "standard operating procedures",
    "sop development",
    "quality control",
    "safety compliance",
    "inventory control",
    "process improvement",
  ],

  certification: [
    ...certificationKeywords,
    "osha",
    "lockout tagout",
    "six sigma",
    "certified scrum master",
  ],

  experience_signal: [
    ...experienceSignals,
    "5 years experience",
    "supervisory experience",
    "maintenance experience",
    "manufacturing experience",
    "equipment maintenance",
    "work orders",
    "vendor management",
  ],
}

// =====================================================
// BLOCK: Normalization Helpers
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

function normalizeAndResolve(value: string): string {
  return resolveSynonym(normalizeAtsKeyword(value))
}

// =====================================================
// BLOCK: Taxonomy Lookup Helpers
// =====================================================

function getCategoryForKeyword(keyword: string): KeywordCategory | null {
  const normalized = normalizeAndResolve(keyword)

  for (const [category, keywords] of Object.entries(TAXONOMY)) {
    const normalizedKeywords = keywords.map(normalizeAndResolve)

    if (normalizedKeywords.includes(normalized)) {
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

  const words = normalized.split(" ")

  if (words.every((word) => STOP_WORDS.has(word))) {
    return true
  }

  if (words.every((word) => GENERIC_BLOCKLIST.has(word))) {
    return true
  }

  if (words.length === 1 && normalized.length < 4) {
    return true
  }

  return false
}

// =====================================================
// BLOCK: Phrase Priority Builder
// Includes both canonical keywords and synonym aliases.
// Long phrases are matched first to prevent splitting
// "root cause analysis" into weaker single-word matches.
// =====================================================

function buildPhrasePriorityList(): string[] {
  const canonicalKeywords = Object.values(TAXONOMY).flat().map(normalizeAtsKeyword)

  const synonymAliases = Object.keys(SYNONYMS).map(normalizeAtsKeyword)

  const synonymCanonicals = Object.values(SYNONYMS).map(normalizeAtsKeyword)

  return [...canonicalKeywords, ...synonymAliases, ...synonymCanonicals]
    .map(normalizeAtsKeyword)
    .filter((keyword) => !isBlockedKeyword(keyword))
    .filter((keyword, index, array) => array.indexOf(keyword) === index)
    .sort((a, b) => b.split(" ").length - a.split(" ").length || b.length - a.length)
}

// =====================================================
// BLOCK: Public Keyword Extraction
// =====================================================

export function extractTaxonomyKeywords(text: string): TaxonomyMatch[] {
  const normalizedText = normalizeAtsKeyword(text)
  const matches = new Map<string, TaxonomyMatch>()

  for (const phrase of buildPhrasePriorityList()) {
    const canonical = normalizeAndResolve(phrase)
    const category = getCategoryForKeyword(canonical)

    if (!category || isBlockedKeyword(canonical)) {
      continue
    }

    const pattern = new RegExp(`(^|\\s)${escapeRegExp(phrase)}(\\s|$)`, "i")

    if (!pattern.test(normalizedText)) {
      continue
    }

    matches.set(canonical, {
      keyword: canonical,
      normalized: canonical,
      category,
      matchedText: phrase,
      confidence: canonical.includes(" ") ? "high" : "medium",
    })
  }

  return Array.from(matches.values())
}

// =====================================================
// BLOCK: Public Keyword Filtering
// =====================================================

export function filterValidAtsKeywords(keywords: string[]): string[] {
  return keywords
    .map(normalizeAndResolve)
    .filter((keyword) => !isBlockedKeyword(keyword))
    .filter((keyword) => getCategoryForKeyword(keyword) !== null)
    .filter((keyword, index, array) => array.indexOf(keyword) === index)
}

// =====================================================
// BLOCK: Public Keyword Classification
// =====================================================

export function classifyKeyword(keyword: string): KeywordCategory | null {
  const normalized = normalizeAndResolve(keyword)

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