import {
  getMissingOpenAIEnvKeys,
  isOpenAIConfigured,
} from "@/lib/ai/openai-env"

export async function GET() {
  const configured = isOpenAIConfigured()
  const missingKeys = getMissingOpenAIEnvKeys()

  return Response.json({
    configured,
    missingKeys,
    timestamp: new Date().toISOString(),
  })
}