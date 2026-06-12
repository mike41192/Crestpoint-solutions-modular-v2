export type NetworkingOutreachIconKey =
  | "calendar"
  | "contacts"
  | "linkedin"
  | "message"
  | "pipeline"
  | "send"
  | "sparkles"
  | "user-plus"
  | "users"

export type NetworkingOutreachHeroContent = {
  eyebrow: string
  title: string
  description: string
  nextStepTitle: string
  nextStepLabel: string
  nextStepHref: string
}

export type NetworkingOutreachPlaybook = {
  id: string
  title: string
  subtitle: string
  description: string
  cardLabel: string
  href: string
  iconKey: NetworkingOutreachIconKey
  estimatedTime: string
  outcome: string
  resumeSourceHints: string[]
  jobDescriptionSourceHints: string[]
  checklist: string[]
  templates: NetworkingOutreachTemplate[]
  customizationFields: string[]
  nextActions: string[]
  usageNote: string
  connectedTools: {
    title: string
    description: string
    href: string
    iconKey: NetworkingOutreachIconKey
  }[]
  relatedPlaybookIds: string[]
}

export type NetworkingOutreachTemplate = {
  label: string
  bestFor: string
  subject: string
  body: string
}

export type NetworkingOutreachWorkflowLink = {
  title: string
  description: string
  href: string
  iconKey: NetworkingOutreachIconKey
}
