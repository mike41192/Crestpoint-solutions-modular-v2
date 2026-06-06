// =====================================================
// BLOCK: Follow-Up Generator
// Crestpoint Solutions V2
// Version: 1.9.9
//
// Phase 1:
// Local templates
//
// Future:
// OpenAI integration
// =====================================================

import type {
  FollowUpGenerationRequest,
  FollowUpGenerationResponse,
} from "./types"

// =====================================================
// BLOCK: Helpers
// =====================================================

function companyName(value?: string | null) {
  return value?.trim() || "your company"
}

// =====================================================
// BLOCK: Generator
// =====================================================

export async function generateFollowUpMessage(
  request: FollowUpGenerationRequest,
): Promise<FollowUpGenerationResponse> {
  const company = companyName(request.application.company)

  switch (request.type) {
    case "thank_you":
      return {
        subject: `Thank You - ${request.application.title}`,
        message: `Thank you for taking the time to speak with me regarding the ${request.application.title} opportunity at ${company}. I enjoyed learning more about the role and team and remain very interested in contributing to your organization.`,
      }

    case "networking":
      return {
        subject: `Connecting Regarding ${request.application.title}`,
        message: `I hope you are doing well. I recently applied for the ${request.application.title} position at ${company} and wanted to introduce myself. I would appreciate the opportunity to connect and learn more about the organization.`,
      }

    case "recruiter":
      return {
        subject: `Application Follow-Up - ${request.application.title}`,
        message: `I recently submitted my application for the ${request.application.title} role at ${company} and wanted to express my continued interest. I would appreciate any update regarding the hiring process.`,
      }

    case "rejection_recovery":
      return {
        subject: `Thank You For The Opportunity`,
        message: `Thank you for considering my application. While I am disappointed that I was not selected, I appreciate the opportunity to be considered and would welcome consideration for future opportunities.`,
      }

    default:
      return {
        subject: `Follow-Up Regarding ${request.application.title}`,
        message: `I hope you are doing well. I wanted to follow up regarding my application for the ${request.application.title} position at ${company}. I remain very interested in the opportunity and would appreciate any update regarding next steps.`,
      }
  }
}