// =====================================================
// BLOCK: Prompt Builder
// Crestpoint Solutions V2
// Version: 1.9.9
// =====================================================

import type {
  FollowUpGenerationRequest,
} from "./types"

// =====================================================
// BLOCK: Prompt Builder
// =====================================================

export function buildFollowUpPrompt(
  request: FollowUpGenerationRequest,
): string {
  const { application, type } = request

  return `
Job Title:
${application.title}

Company:
${application.company}

Status:
${application.status}

Notes:
${application.notes || "None"}

Next Action:
${application.next_action || "None"}

Message Type:
${type}

Generate a professional career communication message.
Keep it concise.
Use a professional tone.
Return email subject and body.
`
}