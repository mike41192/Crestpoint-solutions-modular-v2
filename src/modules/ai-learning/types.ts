export type AILearningSeverity =
  | "info"
  | "positive"
  | "needs_review"
  | "critical"

export type AIPromptSuggestionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "applied"

export type AIPromptStrengthSignal =
  | "strong"
  | "healthy"
  | "watch"
  | "weak"
  | "unproven"

export type AILearningEventPayload = {
  userId?: string | null
  moduleKey: string
  featureKey: string
  eventType: string
  promptVersion?: string | null
  rubricVersion?: string | null
  model?: string | null
  inputSummary?: string | null
  outputSummary?: string | null
  score?: number | null
  userRating?: number | null
  userFeedback?: string | null
  severity?: AILearningSeverity
  improvementTags?: string[]
  metadata?: Record<string, unknown>
}

export type AILearningEventRecord = {
  id: string
  user_id: string | null
  module_key: string
  feature_key: string
  event_type: string
  prompt_version: string | null
  rubric_version: string | null
  model: string | null
  input_summary: string | null
  output_summary: string | null
  score: number | null
  user_rating: number | null
  user_feedback: string | null
  severity: AILearningSeverity
  improvement_tags: string[]
  metadata: Record<string, unknown>
  created_at: string
}

export type AIPromptImprovementSuggestion = {
  id: string
  module_key: string
  feature_key: string
  source_event_id: string | null
  status: AIPromptSuggestionStatus
  priority: number
  suggestion_type: string
  title: string
  rationale: string
  prompt_guidance: string
  evidence: Record<string, unknown>
  quality_score: number
  strength_signal: AIPromptStrengthSignal
  positive_signal_count: number
  negative_signal_count: number
  total_signal_count: number
  last_scored_at: string | null
  reviewer_note: string | null
  reviewed_at: string | null
  applied_at: string | null
  created_at: string
}

export type AIQualitySummary = {
  totalEvents: number
  positiveEvents: number
  needsReviewEvents: number
  criticalEvents: number
  averageRating: number | null
  averageScore: number | null
  pendingSuggestions: number
  approvedGuidance: number
  strongPrompts: number
  weakPrompts: number
  recentEvents: AILearningEventRecord[]
  suggestions: AIPromptImprovementSuggestion[]
}
