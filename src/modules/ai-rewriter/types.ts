export type RewriteType =
  | "summary"
  | "experience"
  | "skills"
  | "keywords"

export interface RewriteRequest {
  originalText: string
  jobDescription?: string
  missingKeywords?: string[]
}

export interface RewriteResult {
  originalText: string
  rewrittenText: string
  explanation: string
  estimatedImprovement: number
}

export interface RewriteSuggestion {
  id: string
  type: RewriteType
  title: string
  result: RewriteResult
}
