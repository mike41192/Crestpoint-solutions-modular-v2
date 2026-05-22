const requiredOpenAIEnvKeys = [
  "OPENAI_API_KEY",
] as const

export function getMissingOpenAIEnvKeys() {
  return requiredOpenAIEnvKeys.filter((key) => !process.env[key])
}

export function isOpenAIConfigured() {
  return getMissingOpenAIEnvKeys().length === 0
}