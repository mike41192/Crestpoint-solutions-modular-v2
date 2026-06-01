// =====================================================
// BLOCK: Imports
// =====================================================

import type { PhraseMapping } from "./types"

// =====================================================
// BLOCK: Leadership Phrase Mappings
// =====================================================

const leadershipMappings: PhraseMapping[] = [
  {
    skill: "team leadership",
    phrases: [
      "managed a team",
      "led a team",
      "supervised employees",
      "oversaw staff",
      "directed team operations",
      "managed personnel",
      "led staff",
      "supervised team members",
    ],
  },

  {
    skill: "employee training",
    phrases: [
      "trained employees",
      "trained new hires",
      "conducted training",
      "developed training materials",
      "mentored employees",
      "coached employees",
      "facilitated training",
      "onboarded new hires",
    ],
  },

  {
    skill: "staff supervision",
    phrases: [
      "supervised staff",
      "managed staff",
      "oversaw employees",
      "directed daily operations",
      "managed workforce",
    ],
  },
]

// =====================================================
// BLOCK: Project Management Phrase Mappings
// =====================================================

const projectManagementMappings: PhraseMapping[] = [
  {
    skill: "project management",
    phrases: [
      "managed projects",
      "led projects",
      "coordinated projects",
      "executed projects",
      "delivered projects",
      "oversaw project execution",
      "managed project timelines",
      "completed projects",
    ],
  },

  {
    skill: "vendor management",
    phrases: [
      "managed vendors",
      "coordinated vendors",
      "worked with vendors",
      "negotiated vendor contracts",
      "maintained vendor relationships",
    ],
  },
]

// =====================================================
// BLOCK: Operations Phrase Mappings
// =====================================================

const operationsMappings: PhraseMapping[] = [
  {
    skill: "process improvement",
    phrases: [
      "improved processes",
      "streamlined operations",
      "reduced inefficiencies",
      "optimized workflows",
      "implemented improvements",
      "improved productivity",
      "improved efficiency",
      "enhanced operations",
    ],
  },

  {
    skill: "root cause analysis",
    phrases: [
      "identified root causes",
      "performed root cause analysis",
      "resolved recurring issues",
      "investigated failures",
      "analyzed operational issues",
    ],
  },
]

// =====================================================
// BLOCK: Manufacturing Phrase Mappings
// =====================================================

const manufacturingMappings: PhraseMapping[] = [
  {
    skill: "preventive maintenance",
    phrases: [
      "performed preventive maintenance",
      "completed maintenance schedules",
      "maintained equipment",
      "executed maintenance plans",
      "conducted routine maintenance",
    ],
  },

  {
    skill: "troubleshooting",
    phrases: [
      "troubleshot equipment",
      "diagnosed equipment failures",
      "resolved equipment issues",
      "performed diagnostics",
      "repaired equipment",
    ],
  },
]

// =====================================================
// BLOCK: Customer Service Phrase Mappings
// =====================================================

const customerServiceMappings: PhraseMapping[] = [
  {
    skill: "customer service",
    phrases: [
      "assisted customers",
      "supported customers",
      "resolved customer issues",
      "handled customer inquiries",
      "provided customer support",
    ],
  },

  {
    skill: "customer relationship management",
    phrases: [
      "managed client relationships",
      "maintained customer relationships",
      "supported key accounts",
      "worked directly with clients",
    ],
  },
]

// =====================================================
// BLOCK: Sales Phrase Mappings
// =====================================================

const salesMappings: PhraseMapping[] = [
  {
    skill: "sales",
    phrases: [
      "closed sales",
      "generated revenue",
      "increased sales",
      "exceeded sales goals",
      "met sales targets",
    ],
  },

  {
    skill: "lead generation",
    phrases: [
      "generated leads",
      "qualified leads",
      "prospected clients",
      "developed sales opportunities",
    ],
  },
]

// =====================================================
// BLOCK: Public Registry
// =====================================================

export const phraseTaxonomy: PhraseMapping[] = [
  ...leadershipMappings,
  ...projectManagementMappings,
  ...operationsMappings,
  ...manufacturingMappings,
  ...customerServiceMappings,
  ...salesMappings,
]
