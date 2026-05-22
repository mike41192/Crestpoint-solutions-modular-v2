const requiredVercelEnvKeys = ["VERCEL_PROJECT_ID", "VERCEL_TEAM_ID"] as const

export function getMissingVercelEnvKeys() {
  return requiredVercelEnvKeys.filter((key) => !process.env[key])
}

export function isVercelConfigured() {
  return getMissingVercelEnvKeys().length === 0
}