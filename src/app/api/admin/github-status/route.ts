import { requireAdminUser } from "@/lib/security/admin-auth"

import {
  getMissingGitHubEnvKeys,
  isGitHubConfigured,
} from "@/lib/github/github-env"

export async function GET() {
  const admin = await requireAdminUser()

  if (admin.ok === false) {
    return admin.response
  }

  return Response.json({
    status: "success",
    configured: isGitHubConfigured(),
    missingKeys: getMissingGitHubEnvKeys(),
    repository: process.env.GITHUB_REPO || null,
    checkedBy: admin.email,
    timestamp: new Date().toISOString(),
  })
}
