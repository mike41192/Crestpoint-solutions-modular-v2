const requiredAppEnvKeys = [
  "NEXT_PUBLIC_APP_URL",
] as const

export function getMissingAppEnvKeys() {
  return requiredAppEnvKeys.filter((key) => !process.env[key])
}

export function isAppEnvConfigured() {
  return getMissingAppEnvKeys().length === 0
}