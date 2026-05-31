const commonStopWords = new Set([
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
  "has",
  "have",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "our",
  "that",
  "the",
  "their",
  "this",
  "to",
  "with",
  "you",
  "your",
])

export function normalizeKeywordText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export function tokenizeJobDescription(jobDescription: string): string[] {
  const normalized = normalizeKeywordText(jobDescription)

  return normalized
    .split(" ")
    .map((word) => word.trim())
    .filter((word) => word.length >= 3)
    .filter((word) => !commonStopWords.has(word))
}

export function extractJobKeywords(jobDescription: string): string[] {
  const tokens = tokenizeJobDescription(jobDescription)
  const frequencyMap = new Map<string, number>()

  tokens.forEach((token) => {
    frequencyMap.set(token, (frequencyMap.get(token) || 0) + 1)
  })

  return Array.from(frequencyMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([keyword]) => keyword)
    .slice(0, 40)
}
