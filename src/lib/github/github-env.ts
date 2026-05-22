const requiredGitHubEnvKeys = ["GITHUB_REPO"] as const

export function getMissingGitHubEnvKeys() {
  return requiredGitHubEnvKeys.filter((key) => !process.env[key])
}

export function isGitHubConfigured() {
  return getMissingGitHubEnvKeys().length === 0
}