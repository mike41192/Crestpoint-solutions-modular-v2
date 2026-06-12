import {
  LINKEDIN_OPTIMIZER_HERO,
  LINKEDIN_OPTIMIZER_SECTIONS,
  LINKEDIN_OPTIMIZER_WORKFLOW_LINKS,
} from "./constants"

export function listLinkedInOptimizerSections() {
  return LINKEDIN_OPTIMIZER_SECTIONS
}

export function getLinkedInOptimizerSectionById(sectionId: string) {
  return LINKEDIN_OPTIMIZER_SECTIONS.find((section) => section.id === sectionId)
}

export function getRelatedLinkedInOptimizerSections(sectionIds: string[]) {
  return sectionIds
    .map((sectionId) => getLinkedInOptimizerSectionById(sectionId))
    .filter((section) => Boolean(section))
}

export function getLinkedInOptimizerPageContent() {
  return {
    hero: LINKEDIN_OPTIMIZER_HERO,
    sections: LINKEDIN_OPTIMIZER_SECTIONS,
    workflowLinks: LINKEDIN_OPTIMIZER_WORKFLOW_LINKS,
  }
}
