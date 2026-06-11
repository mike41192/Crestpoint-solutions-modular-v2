import type {
  InterviewEvaluationRequest,
  InterviewQuestionRequest,
} from "./types"

export const AI_INTERVIEWER_PROMPT_VERSION = "ai-interviewer-v1.10.0"
export const AI_INTERVIEWER_RUBRIC_VERSION = "star-rubric-v1.10.0"

function limitText(value: string | undefined, maxLength: number) {
  if (!value) {
    return ""
  }

  return value.trim().slice(0, maxLength)
}

export function buildInterviewQuestionPrompt(request: InterviewQuestionRequest) {
  const roleTitle = limitText(request.roleTitle, 120) || "target role"
  const companyName = limitText(request.companyName, 120) || "the target company"
  const jobContext = limitText(request.jobContext, 1800)
  const resumeContext = limitText(request.resumeContext, 1400)
  const previousQuestionIds = request.previousQuestionIds?.join(", ") || "none"

  return `
You are Crestpoint's AI Interviewer for job seekers.

Generate one realistic interview practice question.

Context:
- Role: ${roleTitle}
- Company: ${companyName}
- Practice mode: ${request.interviewMode}
- Category: ${request.category}
- Difficulty: ${request.difficulty}
- Previous taxonomy question IDs: ${previousQuestionIds}
- Job context: ${jobContext || "No job context provided."}
- Resume context: ${resumeContext || "No resume context provided."}

Return JSON only with this shape:
{
  "question": "one concise interview question",
  "competency": "primary competency being tested",
  "evaluationSignals": ["3 to 5 concise rubric signals"],
  "followUpPrompts": ["2 to 3 realistic follow-up questions"],
  "coachingTip": "one coaching tip for answering well"
}

Rules:
- Make the question specific to the role when enough context exists.
- Do not invent user experience.
- Do not ask illegal or discriminatory interview questions.
- Prefer questions that can be answered with STAR structure.
`.trim()
}

export function buildInterviewEvaluationPrompt(request: InterviewEvaluationRequest) {
  const roleTitle = limitText(request.roleTitle, 120) || "target role"
  const companyName = limitText(request.companyName, 120) || "the target company"
  const jobContext = limitText(request.jobContext, 1800)
  const answer = limitText(request.answer, 5000)
  const signals = request.question.evaluationSignals.join(", ")

  return `
You are Crestpoint's AI Interviewer evaluating a job seeker's practice answer.

Evaluate the answer against the question, STAR structure, role relevance, specificity, evidence, and communication quality.

Context:
- Role: ${roleTitle}
- Company: ${companyName}
- Category: ${request.question.category}
- Difficulty: ${request.question.difficulty}
- Competency: ${request.question.competency}
- Rubric signals: ${signals}
- Job context: ${jobContext || "No job context provided."}

Question:
${request.question.question}

User answer:
${answer}

Return JSON only with this shape:
{
  "score": 0-100,
  "verdict": "short verdict",
  "summary": "2 sentence coaching summary",
  "strengths": ["2 to 3 strengths"],
  "improvements": ["3 specific improvements"],
  "rewrittenAnswer": "a stronger concise answer structure the user can adapt without inventing facts",
  "followUpQuestion": "one likely interviewer follow-up"
}

Rules:
- Do not fabricate details the user did not provide.
- If the answer lacks evidence, say exactly what evidence is missing.
- Keep coaching direct, practical, and interview-ready.
`.trim()
}
