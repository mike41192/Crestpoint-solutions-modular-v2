import {
  NETWORKING_OUTREACH_HERO,
  NETWORKING_OUTREACH_PLAYBOOKS,
  NETWORKING_OUTREACH_WORKFLOW_LINKS,
} from "./constants"

export function listNetworkingOutreachPlaybooks() {
  return NETWORKING_OUTREACH_PLAYBOOKS
}

export function getNetworkingOutreachPlaybookById(playbookId: string) {
  return NETWORKING_OUTREACH_PLAYBOOKS.find(
    (playbook) => playbook.id === playbookId,
  )
}

export function getRelatedNetworkingOutreachPlaybooks(playbookIds: string[]) {
  return playbookIds
    .map((playbookId) => getNetworkingOutreachPlaybookById(playbookId))
    .filter((playbook) => Boolean(playbook))
}

export function getNetworkingOutreachPageContent() {
  return {
    hero: NETWORKING_OUTREACH_HERO,
    playbooks: NETWORKING_OUTREACH_PLAYBOOKS,
    workflowLinks: NETWORKING_OUTREACH_WORKFLOW_LINKS,
  }
}
