// =====================================================
// BLOCK: Industry Skill Requirements
// Crestpoint Solutions V2
// Version: 1.6.1
// =====================================================

export type IndustrySkillRequirement = {
  industry: string
  requiredSkills: string[]
  preferredSkills: string[]
  leadershipSkills: string[]
  certificationSkills: string[]
}

// =====================================================
// BLOCK: Industry Registry
// =====================================================

export const INDUSTRY_SKILL_REQUIREMENTS: IndustrySkillRequirement[] = [
  {
    industry: "Manufacturing / Maintenance",

    requiredSkills: [
      "preventive maintenance",
      "equipment troubleshooting",
      "root cause analysis",
      "safety compliance",
      "work orders",
      "production equipment",
      "mechanical systems",
      "hydraulic systems",
      "pneumatic systems",
    ],

    preferredSkills: [
      "cmms",
      "lean manufacturing",
      "continuous improvement",
      "inventory management",
      "electrical troubleshooting",
      "plc",
      "predictive maintenance",
    ],

    leadershipSkills: [
      "team leadership",
      "staff training",
      "scheduling",
      "supervision",
    ],

    certificationSkills: [
      "osha",
      "lockout tagout",
      "forklift certification",
    ],
  },

  {
    industry: "Information Technology",

    requiredSkills: [
      "javascript",
      "typescript",
      "api integration",
      "database design",
      "github",
      "debugging",
      "software development",
    ],

    preferredSkills: [
      "react",
      "next.js",
      "cloud",
      "aws",
      "azure",
      "security",
      "devops",
    ],

    leadershipSkills: [
      "project management",
      "team leadership",
      "stakeholder management",
    ],

    certificationSkills: [
      "aws",
      "azure",
      "certified scrum master",
    ],
  },

  {
    industry: "Healthcare",

    requiredSkills: [
      "patient care",
      "medical records",
      "clinical documentation",
      "care coordination",
      "healthcare",
    ],

    preferredSkills: [
      "patient advocacy",
      "case management",
      "electronic health records",
      "quality assurance",
    ],

    leadershipSkills: [
      "care team leadership",
      "training",
      "supervision",
    ],

    certificationSkills: [
      "cpr",
      "bls",
      "rn",
      "lpn",
    ],
  },

  {
    industry: "Sales / Customer Success",

    requiredSkills: [
      "sales",
      "customer relationship management",
      "pipeline management",
      "account management",
      "customer success",
    ],

    preferredSkills: [
      "hubspot",
      "salesforce",
      "lead generation",
      "negotiation",
    ],

    leadershipSkills: [
      "team leadership",
      "coaching",
      "performance management",
    ],

    certificationSkills: [],
  },

  {
    industry: "Operations / Management",

    requiredSkills: [
      "operations management",
      "process improvement",
      "workflow optimization",
      "budget management",
      "staff training",
    ],

    preferredSkills: [
      "lean six sigma",
      "root cause analysis",
      "continuous improvement",
    ],

    leadershipSkills: [
      "team leadership",
      "supervision",
      "employee development",
    ],

    certificationSkills: [
      "lean six sigma",
      "pmp",
    ],
  },
]

// =====================================================
// BLOCK: Fallback Industry
// =====================================================

export const DEFAULT_INDUSTRY_REQUIREMENTS: IndustrySkillRequirement = {
  industry: "General Professional",
  requiredSkills: [],
  preferredSkills: [],
  leadershipSkills: [],
  certificationSkills: [],
}

// =====================================================
// BLOCK: Lookup Helper
// =====================================================

export function getIndustrySkillRequirements(
  industry: string,
): IndustrySkillRequirement {
  return (
    INDUSTRY_SKILL_REQUIREMENTS.find(
      (item) => item.industry === industry,
    ) || DEFAULT_INDUSTRY_REQUIREMENTS
  )
}