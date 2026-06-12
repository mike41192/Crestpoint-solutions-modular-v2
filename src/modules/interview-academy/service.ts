// =====================================================
// BLOCK: Interview Academy Service
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import {
  INTERVIEW_ACADEMY_HERO,
  INTERVIEW_ACADEMY_TOPICS,
  INTERVIEW_ACADEMY_TRACKS,
} from "./constants"
import { interviewAcademyFrameworks } from "./taxonomy"

export function getInterviewAcademyPageContent() {
  return {
    hero: INTERVIEW_ACADEMY_HERO,
    tracks: INTERVIEW_ACADEMY_TRACKS,
    topics: INTERVIEW_ACADEMY_TOPICS,
    frameworks: interviewAcademyFrameworks,
  }
}

export function listInterviewAcademyFrameworks() {
  return interviewAcademyFrameworks
}

export function listInterviewAcademyTopics() {
  return INTERVIEW_ACADEMY_TOPICS
}

export function getInterviewAcademyTopicById(topicId: string) {
  return (
    INTERVIEW_ACADEMY_TOPICS.find((topic) => topic.id === topicId) || null
  )
}

export function getRelatedInterviewAcademyTopics(topicIds: string[]) {
  return topicIds
    .map((topicId) => getInterviewAcademyTopicById(topicId))
    .filter((topic) => topic !== null)
}
