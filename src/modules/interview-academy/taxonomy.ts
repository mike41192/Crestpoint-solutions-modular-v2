// =====================================================
// BLOCK: Interview Academy Framework Taxonomy
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import type { InterviewAcademyFramework } from "./types"

export const interviewAcademyFrameworks: InterviewAcademyFramework[] = [
  {
    id: "star",
    title: "STAR Framework",
    purpose:
      "Structure behavioral answers so they are clear, specific, and outcome-oriented.",
    structure: ["Situation", "Task", "Action", "Result"],
    bestFor: [
      "behavioral questions",
      "leadership examples",
      "conflict resolution",
      "process improvement stories",
    ],
  },
  {
    id: "car",
    title: "CAR Framework",
    purpose:
      "Simplify answers when the interviewer needs a concise challenge-to-result story.",
    structure: ["Challenge", "Action", "Result"],
    bestFor: [
      "short screening answers",
      "resume achievement explanation",
      "high-level career wins",
    ],
  },
  {
    id: "soar",
    title: "SOAR Framework",
    purpose:
      "Connect situational context to ownership and measurable results.",
    structure: ["Situation", "Obstacle", "Action", "Result"],
    bestFor: [
      "problem solving",
      "operational issues",
      "difficult constraints",
      "turnaround stories",
    ],
  },
]
