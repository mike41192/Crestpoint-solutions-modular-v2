export type LinkedInOptimizerIconKey =
  | "badge"
  | "briefcase"
  | "file"
  | "search"
  | "sparkles"
  | "target"
  | "users"

export type LinkedInOptimizerHeroContent = {
  eyebrow: string
  title: string
  description: string
  nextStepTitle: string
  nextStepLabel: string
  nextStepHref: string
}

export type LinkedInOptimizerSection = {
  id: string
  title: string
  subtitle: string
  description: string
  cardLabel: string
  href: string
  iconKey: LinkedInOptimizerIconKey
  estimatedTime: string
  outcome: string
  checklist: string[]
  examples: {
    weak: string
    strong: string
    why: string
  }
  playbook: {
    title: string
    body: string
  }[]
  prompts: string[]
  connectedTools: {
    title: string
    description: string
    href: string
    iconKey: LinkedInOptimizerIconKey
  }[]
  relatedSectionIds: string[]
}

export type LinkedInOptimizerWorkflowLink = {
  title: string
  description: string
  href: string
  iconKey: LinkedInOptimizerIconKey
}
