import { requireAdminUser } from "@/lib/security/admin-auth"

import {
  getMissingOpenAIEnvKeys,
  isOpenAIConfigured,
} from "@/lib/ai/openai-env"

export async function GET() {
  const admin = await requireAdminUser()

  if (admin.ok === false) {
    return admin.response
  }

  return Response.json({
    status: "success",
    configured: isOpenAIConfigured(),
    missingKeys: getMissingOpenAIEnvKeys(),
    checkedBy: admin.email,
    timestamp: new Date().toISOString(),
  })
}