// =====================================================
// BLOCK: Evidence Mapping Types
// =====================================================

export type EvidenceMapping = {
  skill: string
  evidence: string[]
}

// =====================================================
// BLOCK: Evidence Library
// =====================================================

export const evidenceMappings: EvidenceMapping[] = [
  {
    skill: "supervisory experience",
    evidence: [
      "managed team",
      "led team",
      "supervised",
      "supervisor",
      "crew leader",
      "team lead",
      "leadership",
      "trained employees",
      "employee training",
    ],
  },

  {
    skill: "continuous improvement",
    evidence: [
      "workflow improvement",
      "process improvement",
      "improved efficiency",
      "reduced downtime",
      "optimization",
      "efficiency improvement",
      "productivity improvement",
    ],
  },

  {
    skill: "project management",
    evidence: [
      "project lead",
      "capital project",
      "facility project",
      "facility upgrade",
      "implementation project",
      "coordinated project",
      "managed project",
      "project coordination",
    ],
  },

  {
    skill: "inventory management",
    evidence: [
      "inventory control",
      "parts inventory",
      "cycle counts",
      "stock management",
      "warehouse inventory",
      "materials management",
    ],
  },
]
