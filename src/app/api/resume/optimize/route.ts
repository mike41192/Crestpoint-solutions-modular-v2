// =====================================================
// BLOCK: Supabase Server Imports
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: Resume Optimization Imports
// =====================================================

import {
  buildResumeOptimizationPrompt,
  getScaffoldedResumeOptimizationSuggestions,
} from "@/modules/resume-builder"
import type { ResumeBuilderFormData } from "@/modules/resume-builder"

// =====================================================
// BLOCK: Resume Optimize Route
// =====================================================

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return Response.json(
        {
          status: "unauthorized",
          message: "You must be signed in to optimize resumes.",
          suggestions: [],
        },
        { status: 401 },
      )
    }

    const body = await request.json()
    const resume = body?.resume as ResumeBuilderFormData | undefined

    if (!resume) {
      return Response.json(
        {
          status: "error",
          message: "Valid resume data is required.",
          suggestions: [],
        },
        { status: 400 },
      )
    }

    const prompt = buildResumeOptimizationPrompt(resume)
    const suggestions = getScaffoldedResumeOptimizationSuggestions()

    return Response.json({
      status: "scaffolded",
      message:
        "Resume AI optimization system is ready. OpenAI live completion will be connected after final prompt testing.",
      promptPreview: prompt.slice(0, 500),
      suggestions,
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Resume optimization request failed.",
        suggestions: [],
      },
      { status: 500 },
    )
  }
}