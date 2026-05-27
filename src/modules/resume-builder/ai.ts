import type { ResumeBuilderFormData } from "./types"

export type ResumeOptimizationSuggestion = {
  id: string
  category: "summary" | "experience" | "skills" | "formatting" | "ats"
  title: string
  recommendation: string
  suggestedText?: string
  applied: boolean
}

export type ResumeOptimizationResponse = {
  status: "success" | "scaffolded" | "error"
  message: string
  suggestions: ResumeOptimizationSuggestion[]
}

export function buildResumeOptimizationPrompt(data: ResumeBuilderFormData) {
  return `
You are an expert ATS resume optimization assistant.

Review this resume draft and return improvement suggestions only.

Rules:
- Do not invent experience.
- Do not add fake metrics.
- Improve clarity, ATS alignment, action verbs, and structure.
- Suggestions must be practical and truthful.
- Keep recommendations concise.

Resume draft:
${JSON.stringify(data, null, 2)}
`
}

export function getScaffoldedResumeOptimizationSuggestions(): ResumeOptimizationSuggestion[] {
  return [
    {
      id: "summary-1",
      category: "summary",
      title: "Strengthen professional summary",
      recommendation:
        "Make the summary more specific by mentioning target role, years of experience, core strengths, and measurable value.",
      suggestedText:
        "Results-driven professional with experience in operations, leadership, customer service, and process improvement. Skilled at improving workflows, supporting teams, and delivering measurable business results.",
      applied: false,
    },
    {
      id: "experience-1",
      category: "experience",
      title: "Add measurable achievements",
      recommendation:
        "Work experience bullets should include numbers, outcomes, scope, or business impact when truthful.",
      suggestedText:
        "Improved daily workflow efficiency by streamlining team processes and reducing repeated manual tasks.",
      applied: false,
    },
    {
      id: "skills-1",
      category: "skills",
      title: "Improve keyword alignment",
      recommendation:
        "Add relevant role-specific keywords from the job description to strengthen ATS matching.",
      suggestedText:
        "Operations Management, Team Leadership, Process Improvement, Customer Service, Scheduling, Reporting",
      applied: false,
    },
    {
      id: "ats-1",
      category: "ats",
      title: "Use standard resume section labels",
      recommendation:
        "Keep section labels simple and ATS-readable, such as Summary, Experience, Education, Skills, and Certifications.",
      applied: false,
    },
  ]
}