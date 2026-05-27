import {
  buildResumeOptimizationPrompt,
  getScaffoldedResumeOptimizationSuggestions,
} from "@/modules/resume-builder"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const resume = body?.resume

    if (!resume) {
      return Response.json(
        {
          status: "error",
          message: "Resume data is required.",
          suggestions: [],
        },
        {
          status: 400,
        }
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
        message: "Invalid request body.",
        suggestions: [],
      },
      {
        status: 400,
      }
    )
  }
}

export async function GET() {
  return Response.json({
    status: "ok",
    route: "resume_optimize",
  })
}