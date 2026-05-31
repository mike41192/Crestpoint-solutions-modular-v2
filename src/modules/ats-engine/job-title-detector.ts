import type { ResumeBuilderFormData } from "@/modules/resume-builder"

export function detectTargetJobTitle(
  data: ResumeBuilderFormData,
  jobDescription = ""
) {
  const titlePatterns = [
    /job title[:\s]+([^\n]+)/i,
    /position[:\s]+([^\n]+)/i,
    /role[:\s]+([^\n]+)/i,
    /hiring\s+([A-Za-z\s]+?)(?:\.|\n|,)/i,
  ]

  for (const pattern of titlePatterns) {
    const match = jobDescription.match(pattern)

    if (match?.[1]) {
      return match[1].trim().slice(0, 80)
    }
  }

  const firstRole = data.experience.find((job) => job.role?.trim())?.role

  return firstRole || "Target Role Not Detected"
}
