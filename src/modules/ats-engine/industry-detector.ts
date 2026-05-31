import type { ResumeBuilderFormData } from "@/modules/resume-builder"

const industryKeywordMap: Record<string, string[]> = {
  "Manufacturing / Maintenance": [
    "maintenance",
    "mechanic",
    "technician",
    "hydraulic",
    "pneumatic",
    "plc",
    "production",
    "machine",
    "repair",
    "preventive",
    "manufacturing",
  ],
  "Information Technology": [
    "software",
    "developer",
    "engineer",
    "javascript",
    "typescript",
    "react",
    "database",
    "cloud",
    "api",
    "security",
  ],
  "Healthcare": [
    "patient",
    "clinical",
    "healthcare",
    "medical",
    "nursing",
    "care",
    "hospital",
    "pharmacy",
  ],
  "Sales / Customer Success": [
    "sales",
    "customer",
    "account",
    "crm",
    "pipeline",
    "revenue",
    "quota",
    "lead",
  ],
  "Operations / Management": [
    "operations",
    "manager",
    "supervisor",
    "team",
    "process",
    "workflow",
    "budget",
    "training",
  ],
}

function resumeText(data: ResumeBuilderFormData) {
  return [
    data.summary,
    ...data.skills,
    ...data.certifications,
    ...data.experience.flatMap((job) => [
      job.role,
      job.company,
      ...job.bullets,
    ]),
  ]
    .join(" ")
    .toLowerCase()
}

export function detectIndustry(data: ResumeBuilderFormData) {
  const text = resumeText(data)

  const ranked = Object.entries(industryKeywordMap)
    .map(([industry, keywords]) => ({
      industry,
      matches: keywords.filter((keyword) => text.includes(keyword)).length,
    }))
    .sort((a, b) => b.matches - a.matches)

  return ranked[0]?.matches > 0 ? ranked[0].industry : "General Professional"
}
