// =====================================================
// BLOCK: Exports
// Crestpoint Solutions V2
// Version: 1.9.9
// =====================================================

export type {
  FollowUpGenerationRequest,
  FollowUpGenerationResponse,
  FollowUpMessageType,
} from "./types"

export {
  buildFollowUpPrompt,
} from "./prompt-builder"

export {
  generateFollowUpMessage,
} from "./followup-generator"