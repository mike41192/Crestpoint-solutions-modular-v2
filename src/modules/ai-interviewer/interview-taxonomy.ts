// =====================================================
// BLOCK: AI Interview Question Taxonomy
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import type { InterviewQuestionTaxonomyEntry } from "./types"

export const interviewQuestionTaxonomy: InterviewQuestionTaxonomyEntry[] = [
  {
    id: "behavioral-ownership-foundation",
    category: "behavioral",
    difficulty: "foundation",
    competency: "ownership",
    questionStem:
      "Tell me about a time you took ownership of a problem that was not clearly assigned to you.",
    evaluationSignals: [
      "clear context",
      "specific action",
      "measurable result",
      "accountability",
    ],
    followUpPrompts: [
      "What made the problem urgent?",
      "How did you decide what to do first?",
      "What changed after your intervention?",
    ],
  },
  {
    id: "behavioral-conflict-intermediate",
    category: "behavioral",
    difficulty: "intermediate",
    competency: "conflict resolution",
    questionStem:
      "Describe a time you had to resolve disagreement with a coworker, manager, or stakeholder.",
    evaluationSignals: [
      "professional tone",
      "active listening",
      "balanced responsibility",
      "resolution outcome",
    ],
    followUpPrompts: [
      "What did you learn from the disagreement?",
      "How did you keep the conversation productive?",
      "What would you do differently next time?",
    ],
  },
  {
    id: "leadership-coaching-intermediate",
    category: "leadership",
    difficulty: "intermediate",
    competency: "coaching and development",
    questionStem:
      "Tell me about a time you helped someone improve their performance.",
    evaluationSignals: [
      "diagnosed skill gap",
      "coaching action",
      "supportive communication",
      "performance improvement",
    ],
    followUpPrompts: [
      "How did you know your coaching was working?",
      "How did you adapt your approach to the person?",
      "What was the long-term result?",
    ],
  },
  {
    id: "situational-prioritization-foundation",
    category: "situational",
    difficulty: "foundation",
    competency: "prioritization",
    questionStem:
      "If several urgent tasks came up at once, how would you decide what to handle first?",
    evaluationSignals: [
      "prioritization criteria",
      "communication plan",
      "risk awareness",
      "follow-through",
    ],
    followUpPrompts: [
      "Who would you notify first?",
      "How would you handle a task you could not finish immediately?",
      "What information would you need before deciding?",
    ],
  },
  {
    id: "technical-process-advanced",
    category: "technical",
    difficulty: "advanced",
    competency: "process improvement",
    questionStem:
      "Walk me through a process you improved, including the problem, data, change, and result.",
    evaluationSignals: [
      "baseline problem",
      "root cause thinking",
      "implemented change",
      "quantified impact",
    ],
    followUpPrompts: [
      "What data showed the process needed improvement?",
      "How did you avoid disrupting the team?",
      "How did you measure success?",
    ],
  },
  {
    id: "culture-growth-foundation",
    category: "culture",
    difficulty: "foundation",
    competency: "learning mindset",
    questionStem:
      "Tell me about feedback you received and how you used it to improve.",
    evaluationSignals: [
      "receptiveness",
      "specific feedback",
      "behavior change",
      "maturity",
    ],
    followUpPrompts: [
      "Was the feedback hard to hear?",
      "What did you change afterward?",
      "How do you seek feedback now?",
    ],
  },
]
