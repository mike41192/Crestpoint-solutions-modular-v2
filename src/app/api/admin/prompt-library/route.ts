import { requireAdminUser } from "@/lib/security/admin-auth"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { recalculatePromptGuidanceScores } from "@/modules/ai-learning"
import type {
  AIPromptImprovementSuggestion,
  AIPromptStrengthSignal,
  AIPromptSuggestionStatus,
} from "@/modules/ai-learning/types"

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
}

const PROMPT_STATUSES = ["pending", "approved", "rejected", "applied"] as const
const STRENGTH_SIGNALS = ["strong", "healthy", "watch", "weak", "unproven"] as const

type PromptStatus = (typeof PROMPT_STATUSES)[number]
type StrengthSignal = (typeof STRENGTH_SIGNALS)[number]

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function cleanKey(value: unknown, fallback = "general") {
  const key = cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")

  return key || fallback
}

function cleanStatus(value: unknown): PromptStatus {
  return PROMPT_STATUSES.includes(value as PromptStatus)
    ? (value as PromptStatus)
    : "pending"
}

function cleanStrength(value: unknown): StrengthSignal {
  return STRENGTH_SIGNALS.includes(value as StrengthSignal)
    ? (value as StrengthSignal)
    : "unproven"
}

function cleanPriority(value: unknown) {
  const priority = Number(value)

  if (!Number.isFinite(priority)) {
    return 2
  }

  return Math.max(1, Math.min(5, Math.round(priority)))
}

function cleanQualityScore(value: unknown) {
  const score = Number(value)

  if (!Number.isFinite(score)) {
    return 70
  }

  return Math.max(0, Math.min(100, Math.round(score)))
}

function statusTimestamps(
  status: PromptStatus,
  existing?: AIPromptImprovementSuggestion | null,
) {
  const now = new Date().toISOString()

  if (status === "applied") {
    return {
      reviewed_at: existing?.reviewed_at || now,
      applied_at: existing?.applied_at || now,
    }
  }

  if (status === "approved" || status === "rejected") {
    return {
      reviewed_at: existing?.reviewed_at || now,
      applied_at: null,
    }
  }

  return {
    reviewed_at: null,
    applied_at: null,
  }
}

function summarizePrompts(prompts: AIPromptImprovementSuggestion[]) {
  const modules = Array.from(new Set(prompts.map((prompt) => prompt.module_key))).sort()
  const features = Array.from(
    new Set(prompts.map((prompt) => `${prompt.module_key}/${prompt.feature_key}`)),
  ).sort()

  return {
    total: prompts.length,
    pending: prompts.filter((prompt) => prompt.status === "pending").length,
    approved: prompts.filter((prompt) => prompt.status === "approved").length,
    applied: prompts.filter((prompt) => prompt.status === "applied").length,
    rejected: prompts.filter((prompt) => prompt.status === "rejected").length,
    strong: prompts.filter((prompt) => prompt.strength_signal === "strong").length,
    weak: prompts.filter((prompt) => ["weak", "watch"].includes(prompt.strength_signal))
      .length,
    averageScore:
      prompts.length === 0
        ? null
        : Math.round(
            prompts.reduce((total, prompt) => total + prompt.quality_score, 0) /
              prompts.length,
          ),
    modules,
    features,
  }
}

async function loadPrompt(id: string) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("ai_prompt_improvement_suggestions")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data as AIPromptImprovementSuggestion | null
}

export async function GET() {
  const admin = await requireAdminUser()

  if (!admin.ok) {
    return admin.response
  }

  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from("ai_prompt_improvement_suggestions")
      .select("*")
      .order("status", { ascending: true })
      .order("quality_score", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(500)

    if (error) {
      throw new Error(error.message)
    }

    const prompts = (data || []) as AIPromptImprovementSuggestion[]

    return Response.json(
      {
        status: "success",
        admin: admin.email,
        prompts,
        summary: summarizePrompts(prompts),
        statuses: PROMPT_STATUSES,
        strengthSignals: STRENGTH_SIGNALS,
      },
      { headers: NO_STORE_HEADERS },
    )
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Prompt library could not be loaded.",
      },
      { status: 500, headers: NO_STORE_HEADERS },
    )
  }
}

export async function POST(request: Request) {
  const admin = await requireAdminUser()

  if (!admin.ok) {
    return admin.response
  }

  try {
    const body = await request.json()
    const action = cleanText(body?.action)
    const supabase = createSupabaseAdminClient()

    if (action === "create") {
      const moduleKey = cleanKey(body?.moduleKey)
      const featureKey = cleanKey(body?.featureKey)
      const title = cleanText(body?.title)
      const rationale = cleanText(body?.rationale)
      const promptGuidance = cleanText(body?.promptGuidance)

      if (!title || !rationale || !promptGuidance) {
        return Response.json(
          {
            status: "error",
            message: "Title, rationale, and prompt guidance are required.",
          },
          { status: 400, headers: NO_STORE_HEADERS },
        )
      }

      const promptStatus = cleanStatus(body?.promptStatus)
      const timestamps = statusTimestamps(promptStatus)
      const { data, error } = await supabase
        .from("ai_prompt_improvement_suggestions")
        .insert({
          module_key: moduleKey,
          feature_key: featureKey,
          source_event_id: null,
          status: promptStatus,
          priority: cleanPriority(body?.priority),
          suggestion_type: cleanKey(body?.suggestionType, "manual_prompt_guidance"),
          title,
          rationale,
          prompt_guidance: promptGuidance,
          evidence: {
            source: "admin_prompt_library",
            createdBy: admin.email,
          },
          reviewer_note: cleanText(body?.reviewerNote) || null,
          quality_score: cleanQualityScore(body?.qualityScore),
          strength_signal: cleanStrength(body?.strengthSignal),
          positive_signal_count: 0,
          negative_signal_count: 0,
          total_signal_count: 0,
          last_scored_at: new Date().toISOString(),
          ...timestamps,
        })
        .select("*")
        .maybeSingle()

      if (error || !data) {
        throw new Error(error?.message || "Prompt guidance was not created.")
      }

      return Response.json(
        {
          status: "success",
          message: "Prompt guidance created.",
          prompt: data,
        },
        { headers: NO_STORE_HEADERS },
      )
    }

    if (action === "update") {
      const id = cleanText(body?.id)

      if (!id) {
        return Response.json(
          { status: "error", message: "Prompt id is required." },
          { status: 400, headers: NO_STORE_HEADERS },
        )
      }

      const existing = await loadPrompt(id)

      if (!existing) {
        return Response.json(
          { status: "error", message: "Prompt guidance was not found." },
          { status: 404, headers: NO_STORE_HEADERS },
        )
      }

      const promptStatus = cleanStatus(body?.promptStatus)
      const timestamps = statusTimestamps(promptStatus, existing)
      const { data, error } = await supabase
        .from("ai_prompt_improvement_suggestions")
        .update({
          module_key: cleanKey(body?.moduleKey),
          feature_key: cleanKey(body?.featureKey),
          status: promptStatus,
          priority: cleanPriority(body?.priority),
          suggestion_type: cleanKey(body?.suggestionType, "manual_prompt_guidance"),
          title: cleanText(body?.title),
          rationale: cleanText(body?.rationale),
          prompt_guidance: cleanText(body?.promptGuidance),
          reviewer_note: cleanText(body?.reviewerNote) || null,
          quality_score: cleanQualityScore(body?.qualityScore),
          strength_signal: cleanStrength(body?.strengthSignal),
          last_scored_at: new Date().toISOString(),
          ...timestamps,
        })
        .eq("id", id)
        .select("*")
        .maybeSingle()

      if (error || !data) {
        throw new Error(error?.message || "Prompt guidance was not updated.")
      }

      return Response.json(
        {
          status: "success",
          message: "Prompt guidance updated.",
          prompt: data,
        },
        { headers: NO_STORE_HEADERS },
      )
    }

    if (action === "set_status") {
      const id = cleanText(body?.id)
      const promptStatus = cleanStatus(body?.promptStatus)
      const existing = id ? await loadPrompt(id) : null

      if (!id || !existing) {
        return Response.json(
          { status: "error", message: "Prompt guidance was not found." },
          { status: 404, headers: NO_STORE_HEADERS },
        )
      }

      const { error } = await supabase
        .from("ai_prompt_improvement_suggestions")
        .update({
          status: promptStatus,
          reviewer_note:
            cleanText(body?.reviewerNote) ||
            existing.reviewer_note ||
            `Reviewed by ${admin.email || "admin"}`,
          ...statusTimestamps(promptStatus, existing),
        })
        .eq("id", id)

      if (error) {
        throw new Error(error.message)
      }

      return Response.json(
        {
          status: "success",
          message: `Prompt marked ${promptStatus}.`,
        },
        { headers: NO_STORE_HEADERS },
      )
    }

    if (action === "recalculate") {
      const moduleKey = cleanKey(body?.moduleKey)
      const featureKey = cleanKey(body?.featureKey)

      await recalculatePromptGuidanceScores(moduleKey, featureKey)

      return Response.json(
        {
          status: "success",
          message: "Prompt score recalculated from learning events.",
        },
        { headers: NO_STORE_HEADERS },
      )
    }

    if (action === "delete") {
      const id = cleanText(body?.id)

      if (!id) {
        return Response.json(
          { status: "error", message: "Prompt id is required." },
          { status: 400, headers: NO_STORE_HEADERS },
        )
      }

      const { error } = await supabase
        .from("ai_prompt_improvement_suggestions")
        .delete()
        .eq("id", id)

      if (error) {
        throw new Error(error.message)
      }

      return Response.json(
        {
          status: "success",
          message: "Prompt guidance deleted.",
        },
        { headers: NO_STORE_HEADERS },
      )
    }

    return Response.json(
      { status: "error", message: "Unsupported prompt library action." },
      { status: 400, headers: NO_STORE_HEADERS },
    )
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Prompt library action failed.",
      },
      { status: 500, headers: NO_STORE_HEADERS },
    )
  }
}
