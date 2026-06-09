// =====================================================
// BLOCK: Interview Academy Service
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import {
  INTERVIEW_ACADEMY_HERO,
  INTERVIEW_ACADEMY_TRACKS,
} from "./constants"
import { interviewAcademyFrameworks } from "./taxonomy"

export function getInterviewAcademyPageContent() {
  return {
    hero: INTERVIEW_ACADEMY_HERO,
    tracks: INTERVIEW_ACADEMY_TRACKS,
    frameworks: interviewAcademyFrameworks,
  }
}

export function listInterviewAcademyFrameworks() {
  return interviewAcademyFrameworks
}
