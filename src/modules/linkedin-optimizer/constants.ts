import type {
  LinkedInOptimizerHeroContent,
  LinkedInOptimizerSection,
  LinkedInOptimizerWorkflowLink,
} from "./types"

export const LINKEDIN_OPTIMIZER_HERO: LinkedInOptimizerHeroContent = {
  eyebrow: "Profile Visibility",
  title: "Build a recruiter-readable LinkedIn presence",
  description:
    "Use your resume, ATS gaps, target jobs, and Career CRM context to tighten how you show up in recruiter searches and outreach.",
  nextStepTitle: "Start with the profile section recruiters scan first",
  nextStepLabel: "Open Headline Playbook",
  nextStepHref: "/dashboard/linkedin/headline-positioning",
}

export const LINKEDIN_OPTIMIZER_SECTIONS: LinkedInOptimizerSection[] = [
  {
    id: "headline-positioning",
    title: "Headline Positioning",
    subtitle: "Make the first line of your profile match the roles you want.",
    description:
      "Shape a recruiter-friendly headline around target roles, industries, and searchable keywords.",
    cardLabel: "High-impact first impression",
    href: "/dashboard/linkedin/headline-positioning",
    iconKey: "target",
    estimatedTime: "10 min",
    outcome: "A clear role-forward headline with searchable language.",
    checklist: [
      "Lead with target title or role family.",
      "Add two to four high-value skill signals.",
      "Include industry, customer, or operational context when it helps.",
      "Remove vague claims that do not map to a recruiter search.",
    ],
    examples: {
      weak: "Experienced professional seeking new opportunities",
      strong:
        "Operations Manager | Lean Process Improvement | Vendor Management | Multi-Site Team Leadership",
      why: "The stronger version names a target role, adds searchable skills, and gives recruiters a clearer reason to keep reading.",
    },
    playbook: [
      {
        title: "Choose a target lane",
        body: "Pick the role family you want to be found for, then write the headline as if a recruiter searched that exact phrase.",
      },
      {
        title: "Stack proof-bearing keywords",
        body: "Use skills that can be supported by resume bullets, projects, certifications, or measurable outcomes elsewhere in the profile.",
      },
      {
        title: "Keep it scannable",
        body: "Use separators sparingly and avoid cramming every skill into the headline. The goal is signal, not a keyword wall.",
      },
    ],
    prompts: [
      "What job title do I want recruiters to associate with me first?",
      "Which three skills appear most often in my saved job descriptions?",
      "What industry or environment makes my experience more specific?",
    ],
    connectedTools: [
      {
        title: "Review Target Jobs",
        description: "Pull repeated role titles and skill language from saved job descriptions.",
        href: "/dashboard/job-descriptions",
        iconKey: "briefcase",
      },
      {
        title: "Run ATS Scoring",
        description: "Use resume gaps to decide which keywords deserve headline space.",
        href: "/dashboard/ats",
        iconKey: "badge",
      },
    ],
    relatedSectionIds: ["keyword-visibility", "about-section"],
  },
  {
    id: "about-section",
    title: "About Section",
    subtitle: "Turn your summary into a concise career narrative.",
    description:
      "Turn your summary into a concise career narrative that supports your resume and applications.",
    cardLabel: "Profile story and credibility",
    href: "/dashboard/linkedin/about-section",
    iconKey: "file",
    estimatedTime: "20 min",
    outcome: "A readable summary that connects your background to your next role.",
    checklist: [
      "Open with role identity and the problems you solve.",
      "Mention two to three proof points or achievement themes.",
      "Use short paragraphs and direct language.",
      "End with target roles, industries, or collaboration focus.",
    ],
    examples: {
      weak:
        "I am a hardworking leader with a passion for success and helping companies grow.",
      strong:
        "I help operations teams reduce friction across vendors, schedules, and frontline workflows. My background includes multi-site coordination, process improvement, and team leadership in fast-moving environments.",
      why: "The stronger version explains what the candidate does, where they create value, and which themes should be validated later in the profile.",
    },
    playbook: [
      {
        title: "Start with value",
        body: "The first two lines should explain who you help, what you improve, and what role lane you are pursuing.",
      },
      {
        title: "Group achievements into themes",
        body: "Instead of rewriting the resume, summarize the patterns behind your wins: cost control, process improvement, customer experience, team development, or revenue impact.",
      },
      {
        title: "Close with direction",
        body: "Make it easy for recruiters and contacts to understand the roles, industries, and conversations that fit your next move.",
      },
    ],
    prompts: [
      "What business problems have I solved more than once?",
      "Which achievements support my next role most clearly?",
      "What should a recruiter understand about me in the first 10 seconds?",
    ],
    connectedTools: [
      {
        title: "Open Resume Builder",
        description: "Borrow achievement language from your strongest resume bullets.",
        href: "/dashboard/resume",
        iconKey: "file",
      },
      {
        title: "Interview Academy",
        description: "Use career story lessons to make your profile narrative sharper.",
        href: "/dashboard/interview-academy",
        iconKey: "sparkles",
      },
    ],
    relatedSectionIds: ["headline-positioning", "relationship-signals"],
  },
  {
    id: "keyword-visibility",
    title: "Keyword Visibility",
    subtitle: "Help recruiters find the skills you actually want to sell.",
    description:
      "Align profile language with job descriptions, ATS findings, and recruiter search patterns.",
    cardLabel: "Search and role alignment",
    href: "/dashboard/linkedin/keyword-visibility",
    iconKey: "search",
    estimatedTime: "15 min",
    outcome: "A profile keyword map tied to target roles and job descriptions.",
    checklist: [
      "Collect recurring keywords from three to five target jobs.",
      "Separate must-have skills from nice-to-have terms.",
      "Place important keywords in headline, about, experience, and skills.",
      "Avoid adding keywords you cannot support in conversation.",
    ],
    examples: {
      weak: "Leadership, communication, teamwork, Microsoft Office",
      strong:
        "Workforce Planning, Process Improvement, KPI Reporting, Vendor Coordination, Customer Experience Operations",
      why: "The stronger set is specific enough to match recruiter searches and still broad enough to support multiple roles.",
    },
    playbook: [
      {
        title: "Build a keyword shortlist",
        body: "Look for terms that repeat across target job descriptions, especially title variants, tools, industry language, and measurable responsibilities.",
      },
      {
        title: "Place keywords naturally",
        body: "Use the most important terms in high-visibility areas first, then reinforce them in experience descriptions and skills.",
      },
      {
        title: "Match confidence to proof",
        body: "If a keyword is important but under-supported, use the resume and interview tools to build clearer evidence before making it prominent.",
      },
    ],
    prompts: [
      "Which keywords appear across most of my saved target jobs?",
      "Which of those keywords can I prove with a result or project?",
      "Where is my LinkedIn profile missing the words recruiters would search?",
    ],
    connectedTools: [
      {
        title: "Saved Job Descriptions",
        description: "Review role language and pull recurring recruiter search terms.",
        href: "/dashboard/job-descriptions",
        iconKey: "briefcase",
      },
      {
        title: "ATS Scoring",
        description: "Use missing-skill analysis as a starting point for LinkedIn keywords.",
        href: "/dashboard/ats",
        iconKey: "badge",
      },
    ],
    relatedSectionIds: ["headline-positioning", "about-section"],
  },
  {
    id: "relationship-signals",
    title: "Relationship Signals",
    subtitle: "Make outreach easier by aligning your profile with your network.",
    description:
      "Use contacts, companies, and outreach context to guide profile updates before networking.",
    cardLabel: "Trust signals before outreach",
    href: "/dashboard/linkedin/relationship-signals",
    iconKey: "users",
    estimatedTime: "15 min",
    outcome: "A profile that supports recruiter outreach, referrals, and warm follow-up.",
    checklist: [
      "Update profile sections before contacting recruiters or referrals.",
      "Make company, role, and industry alignment easy to spot.",
      "Add proof points that support the conversations you want to start.",
      "Connect profile updates to upcoming outreach and follow-up timing.",
    ],
    examples: {
      weak: "Message recruiters before profile and resume are aligned.",
      strong:
        "Refresh headline, about section, and top skills before sending role-specific recruiter or referral messages.",
      why: "The stronger approach makes the profile reinforce outreach instead of forcing the message to carry the whole story.",
    },
    playbook: [
      {
        title: "Prepare before outreach",
        body: "Before messaging a recruiter or contact, make sure your profile confirms the role target and skill story in your message.",
      },
      {
        title: "Use shared context",
        body: "Reference companies, industries, alumni connections, projects, or role themes that make the conversation feel specific.",
      },
      {
        title: "Close the loop",
        body: "After interviews or follow-ups, update profile language when you notice a recurring skill, objection, or role expectation.",
      },
    ],
    prompts: [
      "Who will look at my profile after my next message?",
      "What should that person immediately understand about my fit?",
      "Which profile proof points support the outreach I plan to send?",
    ],
    connectedTools: [
      {
        title: "Career CRM",
        description: "Review recruiters, contacts, notes, and upcoming follow-ups.",
        href: "/dashboard/contacts",
        iconKey: "users",
      },
      {
        title: "Networking Assistant",
        description: "Write outreach after the profile supports the same story.",
        href: "/dashboard/networking",
        iconKey: "sparkles",
      },
    ],
    relatedSectionIds: ["about-section", "keyword-visibility"],
  },
]

export const LINKEDIN_OPTIMIZER_WORKFLOW_LINKS: LinkedInOptimizerWorkflowLink[] = [
  {
    title: "Review Target Jobs",
    description: "Use saved job descriptions to identify recurring profile keywords.",
    href: "/dashboard/job-descriptions",
    iconKey: "briefcase",
  },
  {
    title: "Open Career CRM",
    description: "Review recruiters and networking contacts before profile outreach.",
    href: "/dashboard/contacts",
    iconKey: "users",
  },
  {
    title: "Run ATS Scoring",
    description: "Use resume gaps to find missing LinkedIn positioning signals.",
    href: "/dashboard/ats",
    iconKey: "badge",
  },
]
