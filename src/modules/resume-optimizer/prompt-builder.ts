import type { ResumeOptimizationInput } from "./types"

export function buildResumeOptimizationPrompt(input: ResumeOptimizationInput) {
  const { resume, jobDescription, atsResult } = input

  return `
You are an expert resume strategist and ATS optimization specialist.

Improve the resume for the target job while keeping the candidate truthful.

Target Job Description:
${jobDescription || "No job description provided."}

Current Resume Summary:
${resume.summary || "No summary provided."}

Current Skills:
${resume.skills.join(", ") || "No skills provided."}

Missing Keywords:
${atsResult.missingKeywords.join(", ") || "No missing keywords detected."}

ATS Score:
${atsResult.overallScore}

Keyword Match:
${atsResult.keywordMatchPercent}%

Return practical suggestions only. Do not invent experience the candidate did not provide.
`.trim()
}
