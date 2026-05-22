import {
  getMissingGitHubEnvKeys,
  isGitHubConfigured,
} from "@/lib/github/github-env"

export async function GET() {
  const configured = isGitHubConfigured()
  const missingKeys = getMissingGitHubEnvKeys()

  return Response.json({
    configured,
    missingKeys,
    repository: process.env.GITHUB_REPO || null,
    timestamp: new Date().toISOString(),
  })
}