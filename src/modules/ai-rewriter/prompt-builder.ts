import type { RewriteRequest } from "./types"

export function buildRewritePrompt(
  type: string,
  request: RewriteRequest
) {
  return `
You are an expert ATS resume writer.

Task:
Rewrite the provided resume content.

Rewrite Type:
${type}

Original Content:
${request.originalText}

Job Description:
${request.jobDescription || "Not provided"}

Missing Keywords:
${request.missingKeywords?.join(", ") || "None"}

Rules:
- Keep information truthful
- Improve ATS compatibility
- Improve readability
- Add stronger action verbs
- Naturally include relevant keywords
- Do not invent experience

Return only the rewritten content.
`.trim()
}
