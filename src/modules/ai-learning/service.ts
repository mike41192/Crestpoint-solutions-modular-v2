import { createSupabaseAdminClient } from "@/lib/supabase/admin"

import type {
  AILearningEventPayload,
  AILearningEventRecord,
  AILearningSeverity,
  AIPromptStrengthSignal,
  AIQualitySummary,
  AIPromptImprovementSuggestion,
} from "./types"

const MAX_TEXT_LENGTH = 2000
const SCORING_EVENT_LIMIT = 100

function truncate(value: string | null | undefined, maxLength = MAX_TEXT_LENGTH) {
  if (!value) {
    return null
  }

  return value.trim().slice(0, maxLength) || null
}

function clampRating(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null
  }

  return Math.max(1, Math.min(5, Math.round(value)))
}

function clampScore(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null
  }

  return Math.max(0, Math.min(100, Math.round(value)))
}

function inferSeverity(payload: AILearningEventPayload): AILearningSeverity {
  if (payload.severity) {
    return payload.severity
  }

  if ((payload.userRating ?? 5) <= 2 || (payload.score ?? 100) < 45) {
    return "critical"
  }

  if ((payload.userRating ?? 5) === 3 || (payload.score ?? 100) < 65) {
    return "needs_review"
  }

  if ((payload.userRating ?? 0) >= 4 || (payload.score ?? 0) >= 85) {
    return "positive"
  }

  return "info"
}

function inferTags(payload: AILearningEventPayload) {
  const tags = new Set(payload.improvementTags || [])
  const feedback = `${payload.userFeedback || ""} ${payload.outputSummary || ""}`
    .toLowerCase()

  if (feedback.match(/\b(generic|vague|bland|basic)\b/)) {
    tags.add("specificity")
  }

  if (feedback.match(/\b(wrong|incorrect|inaccurate|made up|invented)\b/)) {
    tags.add("accuracy")
  }

  if (feedback.match(/\b(tone|rude|robotic|awkward|too formal)\b/)) {
    tags.add("tone")
  }

  if (feedback.match(/\b(long|short|verbose|wordy|concise)\b/)) {
    tags.add("length")
  }

  if (tags.size === 0 && inferSeverity(payload) !== "positive") {
    tags.add("quality")
  }

  return Array.from(tags).slice(0, 8)
}

function buildSuggestionFromEvent(event: AILearningEventRecord) {
  if (!["critical", "needs_review"].includes(event.severity)) {
    return null
  }

  const tags = event.improvement_tags || []
  const tagList = tags.length > 0 ? tags.join(", ") : "quality"
  const userFeedback = event.user_feedback || "No user note was provided."

  return {
    module_key: event.module_key,
    feature_key: event.feature_key,
    source_event_id: event.id,
    status: "pending",
    priority: event.severity === "critical" ? 1 : 2,
    suggestion_type: "prompt_guidance",
    title: `Improve ${event.feature_key.replaceAll("_", " ")} ${tagList}`,
    rationale:
      `A ${event.severity} learning event was recorded for ${event.module_key}. ` +
      `User rating: ${event.user_rating ?? "n/a"}. Score: ${event.score ?? "n/a"}.`,
    prompt_guidance:
      `When handling ${event.feature_key.replaceAll("_", " ")}, improve ${tagList}. ` +
      "Use the user's actual context, avoid unsupported claims, make feedback specific and actionable, " +
      "and prefer concise next steps over generic advice.",
    evidence: {
      eventType: event.event_type,
      promptVersion: event.prompt_version,
      rubricVersion: event.rubric_version,
      inputSummary: event.input_summary,
      outputSummary: event.output_summary,
      userFeedback,
      tags,
    },
  }
}

function eventQualityScore(event: AILearningEventRecord) {
  if (typeof event.user_rating === "number") {
    return event.user_rating * 20
  }

  if (typeof event.score === "number") {
    return event.score
  }

  if (event.severity === "positive") {
    return 88
  }

  if (event.severity === "needs_review") {
    return 58
  }

  if (event.severity === "critical") {
    return 32
  }

  return 70
}

function strengthSignal({
  qualityScore,
  positiveSignalCount,
  negativeSignalCount,
  totalSignalCount,
}: {
  qualityScore: number
  positiveSignalCount: number
  negativeSignalCount: number
  totalSignalCount: number
}): AIPromptStrengthSignal {
  if (totalSignalCount === 0) {
    return "unproven"
  }

  if (qualityScore >= 84 && positiveSignalCount >= negativeSignalCount) {
    return "strong"
  }

  if (qualityScore >= 72 && negativeSignalCount === 0) {
    return "healthy"
  }

  if (qualityScore < 58 || negativeSignalCount > positiveSignalCount) {
    return "weak"
  }

  return "watch"
}

export async function recalculatePromptGuidanceScores(
  moduleKey: string,
  featureKey: string,
) {
  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from("ai_learning_events")
      .select("*")
      .eq("module_key", moduleKey)
      .eq("feature_key", featureKey)
      .order("created_at", { ascending: false })
      .limit(SCORING_EVENT_LIMIT)

    if (error) {
      throw new Error(error.message)
    }

    const events = (data || []) as AILearningEventRecord[]
    const scoredEvents = events.filter(
      (event) =>
        typeof event.user_rating === "number" ||
        typeof event.score === "number" ||
        event.severity !== "info",
    )
    const totalSignalCount = scoredEvents.length
    const qualityScore =
      totalSignalCount === 0
        ? 70
        : Math.round(
            scoredEvents.reduce(
              (total, event) => total + eventQualityScore(event),
              0,
            ) / totalSignalCount,
          )
    const positiveSignalCount = scoredEvents.filter(
      (event) => eventQualityScore(event) >= 80 || event.severity === "positive",
    ).length
    const negativeSignalCount = scoredEvents.filter(
      (event) =>
        eventQualityScore(event) < 60 ||
        ["needs_review", "critical"].includes(event.severity),
    ).length
    const signal = strengthSignal({
      qualityScore,
      positiveSignalCount,
      negativeSignalCount,
      totalSignalCount,
    })

    const { error: updateError } = await supabase
      .from("ai_prompt_improvement_suggestions")
      .update({
        quality_score: qualityScore,
        strength_signal: signal,
        positive_signal_count: positiveSignalCount,
        negative_signal_count: negativeSignalCount,
        total_signal_count: totalSignalCount,
        last_scored_at: new Date().toISOString(),
      })
      .eq("module_key", moduleKey)
      .eq("feature_key", featureKey)
      .neq("status", "rejected")

    if (updateError) {
      throw new Error(updateError.message)
    }
  } catch (error) {
    console.error(
      "AI prompt guidance scores were not updated:",
      error instanceof Error ? error.message : "Unknown error",
    )
  }
}

export async function recordAILearningEvent(payload: AILearningEventPayload) {
  try {
    const supabase = createSupabaseAdminClient()
    const severity = inferSeverity(payload)
    const improvementTags = inferTags({ ...payload, severity })

    const { data, error } = await supabase
      .from("ai_learning_events")
      .insert({
        user_id: payload.userId || null,
        module_key: payload.moduleKey,
        feature_key: payload.featureKey,
        event_type: payload.eventType,
        prompt_version: truncate(payload.promptVersion, 120),
        rubric_version: truncate(payload.rubricVersion, 120),
        model: truncate(payload.model, 120),
        input_summary: truncate(payload.inputSummary),
        output_summary: truncate(payload.outputSummary),
        score: clampScore(payload.score),
        user_rating: clampRating(payload.userRating),
        user_feedback: truncate(payload.userFeedback),
        severity,
        improvement_tags: improvementTags,
        metadata: payload.metadata || {},
      })
      .select("*")
      .maybeSingle()

    if (error || !data) {
      throw new Error(error?.message || "Learning event insert failed.")
    }

    const event = data as AILearningEventRecord
    const suggestion = buildSuggestionFromEvent(event)

    if (suggestion) {
      await supabase.from("ai_prompt_improvement_suggestions").insert(suggestion)
    }

    await recalculatePromptGuidanceScores(payload.moduleKey, payload.featureKey)

    return event
  } catch (error) {
    console.error(
      "AI learning event was not recorded:",
      error instanceof Error ? error.message : "Unknown error",
    )

    return null
  }
}

export async function getApprovedPromptGuidance(
  moduleKey: string,
  featureKey: string,
) {
  try {
    const supabase = createSupabaseAdminClient()

    const { data, error } = await supabase
      .from("ai_prompt_improvement_suggestions")
      .select("prompt_guidance")
      .eq("module_key", moduleKey)
      .eq("feature_key", featureKey)
      .in("status", ["approved", "applied"])
      .order("quality_score", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(5)

    if (error || !data) {
      throw new Error(error?.message || "Approved guidance load failed.")
    }

    return data
      .map((item) => item.prompt_guidance)
      .filter(Boolean)
      .join("\n")
  } catch {
    return ""
  }
}

export async function getAIQualitySummary(): Promise<AIQualitySummary> {
  const supabase = createSupabaseAdminClient()

  const [eventsResult, suggestionsResult] = await Promise.all([
    supabase
      .from("ai_learning_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("ai_prompt_improvement_suggestions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100),
  ])

  if (eventsResult.error) {
    throw new Error(eventsResult.error.message)
  }

  if (suggestionsResult.error) {
    throw new Error(suggestionsResult.error.message)
  }

  const events = (eventsResult.data || []) as AILearningEventRecord[]
  const suggestions = (suggestionsResult.data || []) as AIPromptImprovementSuggestion[]
  const ratings = events
    .map((event) => event.user_rating)
    .filter((value): value is number => typeof value === "number")
  const scores = events
    .map((event) => event.score)
    .filter((value): value is number => typeof value === "number")

  return {
    totalEvents: events.length,
    positiveEvents: events.filter((event) => event.severity === "positive").length,
    needsReviewEvents: events.filter((event) => event.severity === "needs_review")
      .length,
    criticalEvents: events.filter((event) => event.severity === "critical").length,
    averageRating: average(ratings),
    averageScore: average(scores),
    pendingSuggestions: suggestions.filter(
      (suggestion) => suggestion.status === "pending",
    ).length,
    approvedGuidance: suggestions.filter((suggestion) =>
      ["approved", "applied"].includes(suggestion.status),
    ).length,
    strongPrompts: suggestions.filter(
      (suggestion) => suggestion.strength_signal === "strong",
    ).length,
    weakPrompts: suggestions.filter((suggestion) =>
      ["weak", "watch"].includes(suggestion.strength_signal),
    ).length,
    recentEvents: events.slice(0, 12),
    suggestions: suggestions.slice(0, 12),
  }
}

function average(values: number[]) {
  if (values.length === 0) {
    return null
  }

  return Math.round(
    values.reduce((total, value) => total + value, 0) / values.length,
  )
}
