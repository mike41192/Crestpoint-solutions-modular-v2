import type {
  NetworkingOutreachHeroContent,
  NetworkingOutreachPlaybook,
  NetworkingOutreachWorkflowLink,
} from "./types"

export const NETWORKING_OUTREACH_HERO: NetworkingOutreachHeroContent = {
  eyebrow: "Relationship Workflow",
  title: "Turn contacts into a consistent search rhythm",
  description:
    "Use Career CRM contacts, application status, and saved notes to plan outreach without losing context between conversations.",
  nextStepTitle: "Start with a recruiter template tied to a real role",
  nextStepLabel: "Open Recruiter Templates",
  nextStepHref: "/dashboard/networking/recruiter-outreach",
}

export const NETWORKING_OUTREACH_PLAYBOOKS: NetworkingOutreachPlaybook[] = [
  {
    id: "recruiter-outreach",
    title: "Recruiter Outreach",
    subtitle: "Start a concise conversation with a recruiter who can act.",
    description:
      "Start a concise conversation with recruiters connected to target roles or companies.",
    cardLabel: "Role-specific templates",
    href: "/dashboard/networking/recruiter-outreach",
    iconKey: "send",
    estimatedTime: "10 min",
    outcome: "A short message that names the role, fit, and next step.",
    resumeSourceHints: [
      "Use one achievement bullet as the proof point.",
      "Pull skills from the resume that match the target job.",
      "Use your summary to keep the message aligned with your positioning.",
    ],
    jobDescriptionSourceHints: [
      "Use the saved role title and company in the opening line.",
      "Pull one requirement as the business problem.",
      "Mirror the job description language in your proof point.",
    ],
    checklist: [
      "Confirm the recruiter is connected to the role, company, or function.",
      "Reference the role or business area in the first two lines.",
      "Add one proof point that matches the target job.",
      "Ask for the smallest useful next step.",
    ],
    templates: [
      {
        label: "Cold Recruiter Message",
        bestFor: "First message to a recruiter tied to a company or open role.",
        subject: "Quick question about [role/company]",
        body:
          "Hi [Name], I saw your team is connected to [role/company]. My background includes [specific skill or result], and I am exploring roles where I can help with [business problem]. If you are the right person, I would appreciate a quick pointer on the best way to be considered.",
      },
      {
        label: "After Applying",
        bestFor: "Following up after submitting an application.",
        subject: "Application submitted for [role]",
        body:
          "Hi [Name], I recently applied for [role] and wanted to briefly introduce myself. My experience with [specific skill/result] aligns closely with [job requirement]. I would be grateful for any guidance on the review process or the best next step.",
      },
      {
        label: "Recruiter Re-Engagement",
        bestFor: "Reconnecting with a recruiter you have spoken with before.",
        subject: "Checking in on [role/function]",
        body:
          "Hi [Name], I hope you have been well. I am still exploring [role/function] opportunities and wanted to reconnect. Since we last spoke, I have been focused on [new skill/result/update]. If anything aligned is open or upcoming, I would appreciate being considered.",
      },
    ],
    customizationFields: [
      "[Name]",
      "[role/company]",
      "[specific skill or result]",
      "[business problem]",
      "[job requirement]",
    ],
    nextActions: [
      "Save the recruiter in Career CRM.",
      "Set a follow-up date based on the role stage.",
      "Update the matching job application status in Job Tracker.",
    ],
    usageNote:
      "Keep recruiter messages short. The goal is to make fit obvious and make the next action easy.",
    connectedTools: [
      {
        title: "Job Pipeline",
        description: "Use current application status to choose timely recruiter messages.",
        href: "/dashboard/jobs",
        iconKey: "pipeline",
      },
      {
        title: "LinkedIn Optimizer",
        description: "Make sure your profile supports the same role story.",
        href: "/dashboard/linkedin",
        iconKey: "linkedin",
      },
    ],
    relatedPlaybookIds: ["follow-up-message", "referral-request"],
  },
  {
    id: "referral-request",
    title: "Referral Request",
    subtitle: "Ask for a referral with context, respect, and a clear fit story.",
    description:
      "Ask for a referral with clear context, role alignment, and respectful timing.",
    cardLabel: "Referral ask templates",
    href: "/dashboard/networking/referral-request",
    iconKey: "user-plus",
    estimatedTime: "15 min",
    outcome: "A referral ask that gives the contact enough context to help.",
    resumeSourceHints: [
      "Use two resume bullets as portable proof points.",
      "Pull the strongest role-aligned skills from the resume.",
      "Use certifications or industry experience when relevant.",
    ],
    jobDescriptionSourceHints: [
      "Use the exact role title and company.",
      "Pull the top requirements to explain fit.",
      "Use the job URL or saved role record before asking.",
    ],
    checklist: [
      "Confirm the contact has a reasonable connection to the company or team.",
      "Share the exact role link or title.",
      "Summarize why the role fits in two to three proof points.",
      "Give the contact an easy way to decline or redirect.",
    ],
    templates: [
      {
        label: "Direct Referral Ask",
        bestFor: "A warm contact at the company.",
        subject: "Referral question for [role]",
        body:
          "Hi [Name], I noticed [company] has an opening for [role]. Based on my background in [skill/result] and [skill/result], it looks closely aligned with what I am targeting. Would you be comfortable referring me or pointing me to the best person to contact? No pressure if timing is not right.",
      },
      {
        label: "Soft Referral Feel-Out",
        bestFor: "A contact you know, but not closely.",
        subject: "Question about [company]",
        body:
          "Hi [Name], I saw [company] is hiring for [role] and wanted to ask if you know how that team usually handles referrals or candidate introductions. I am interested because [fit reason]. Any advice on the best path would be appreciated.",
      },
      {
        label: "Referral Follow-Up",
        bestFor: "Checking back after a referral offer or warm intro.",
        subject: "Thanks again for the referral help",
        body:
          "Hi [Name], thanks again for being willing to help with [role/company]. I wanted to share the role link and a short fit summary: [one-line fit summary]. Please let me know if there is anything else that would make this easier on your side.",
      },
    ],
    customizationFields: [
      "[Name]",
      "[company]",
      "[role]",
      "[skill/result]",
      "[fit reason]",
      "[one-line fit summary]",
    ],
    nextActions: [
      "Attach or prepare the target resume before asking.",
      "Log the referral request in Career CRM.",
      "Follow up only after a reasonable waiting period.",
    ],
    usageNote:
      "Referral requests work best when the contact can quickly understand the role, your fit, and the level of help you need.",
    connectedTools: [
      {
        title: "Career CRM",
        description: "Review relationship notes before asking for help.",
        href: "/dashboard/contacts",
        iconKey: "contacts",
      },
      {
        title: "Job Descriptions",
        description: "Use target role requirements to make the referral ask specific.",
        href: "/dashboard/job-descriptions",
        iconKey: "pipeline",
      },
    ],
    relatedPlaybookIds: ["recruiter-outreach", "networking-check-in"],
  },
  {
    id: "follow-up-message",
    title: "Follow-Up Message",
    subtitle: "Keep warm opportunities moving without sounding pushy.",
    description:
      "Keep applications warm after submitting, interviewing, or connecting with a contact.",
    cardLabel: "Follow-up templates",
    href: "/dashboard/networking/follow-up-message",
    iconKey: "calendar",
    estimatedTime: "10 min",
    outcome: "A follow-up that references context and asks for a clear update.",
    resumeSourceHints: [
      "Use one updated achievement if the follow-up needs fresh signal.",
      "Pull a matching skill when reaffirming fit.",
      "Use resume language to avoid vague interest statements.",
    ],
    jobDescriptionSourceHints: [
      "Use the role title and company consistently.",
      "Reference a job requirement discussed in the interview.",
      "Use the saved job record to keep follow-up timing connected.",
    ],
    checklist: [
      "Anchor the message to the last interaction or application step.",
      "Wait long enough to be reasonable for the stage.",
      "Add one helpful update or reaffirmed fit point.",
      "Ask for status, timing, or the next expected step.",
    ],
    templates: [
      {
        label: "Application Follow-Up",
        bestFor: "Checking in after applying.",
        subject: "Following up on [role]",
        body:
          "Hi [Name], I wanted to follow up on my application for [role]. I remain very interested because [specific fit]. Please let me know if there is anything else I can provide or if there is an updated timeline for next steps.",
      },
      {
        label: "Post-Interview Follow-Up",
        bestFor: "Following up after an interview conversation.",
        subject: "Thank you for the conversation",
        body:
          "Hi [Name], thank you again for speaking with me about [role]. I enjoyed learning more about [conversation detail], and it reinforced my interest in the opportunity. My experience with [specific fit] feels especially aligned. I appreciate your time and look forward to hearing about next steps.",
      },
      {
        label: "Timeline Check",
        bestFor: "When the expected response window has passed.",
        subject: "Checking on timeline for [role]",
        body:
          "Hi [Name], I wanted to check whether there is an updated timeline for [role]. I am still very interested and happy to provide any additional information that would be helpful.",
      },
    ],
    customizationFields: [
      "[Name]",
      "[role]",
      "[specific fit]",
      "[conversation detail]",
    ],
    nextActions: [
      "Update the next follow-up date in Job Tracker.",
      "Record the message in the contact notes.",
      "Move the application stage if the employer replies.",
    ],
    usageNote:
      "Follow-ups should be anchored to a real event or timeline. Avoid sending the same message repeatedly.",
    connectedTools: [
      {
        title: "Job Tracker",
        description: "Use status and next-action dates to decide when to follow up.",
        href: "/dashboard/jobs",
        iconKey: "pipeline",
      },
      {
        title: "Career CRM",
        description: "Update contact history and follow-up notes after messaging.",
        href: "/dashboard/contacts",
        iconKey: "contacts",
      },
    ],
    relatedPlaybookIds: ["recruiter-outreach", "networking-check-in"],
  },
  {
    id: "networking-check-in",
    title: "Networking Check-In",
    subtitle: "Maintain relationships before you need to ask for anything.",
    description:
      "Maintain relationships with mentors, coworkers, and professional contacts.",
    cardLabel: "Check-in templates",
    href: "/dashboard/networking/networking-check-in",
    iconKey: "message",
    estimatedTime: "12 min",
    outcome: "A light-touch message that keeps relationships warm.",
    resumeSourceHints: [
      "Use a brief career update from your latest role or summary.",
      "Pull a recent achievement if the contact knows your work.",
      "Use skills only when they make the update more specific.",
    ],
    jobDescriptionSourceHints: [
      "Use target role themes when asking for perspective later.",
      "Reference companies or industries you are exploring.",
      "Avoid overloading a light check-in with job requirements.",
    ],
    checklist: [
      "Use a real reason to reconnect.",
      "Reference a shared context, update, or useful resource.",
      "Keep the message brief and conversational.",
      "Avoid turning every check-in into an immediate ask.",
    ],
    templates: [
      {
        label: "Simple Reconnection",
        bestFor: "A warm contact you have not spoken with recently.",
        subject: "Quick hello",
        body:
          "Hi [Name], I was thinking about [shared context/update] and wanted to say hello. I hope things are going well with [their company/project]. I have been working on [short update]. No big ask here, just wanted to reconnect and see how you have been.",
      },
      {
        label: "Value-Add Check-In",
        bestFor: "Sharing a useful resource or update.",
        subject: "Thought this might be useful",
        body:
          "Hi [Name], I came across [resource/update] and thought of your work on [topic/project]. Hope it is useful. I would also enjoy catching up sometime soon if your schedule allows.",
      },
      {
        label: "Congratulations Message",
        bestFor: "Reacting to a promotion, new role, award, or public update.",
        subject: "Congrats on [update]",
        body:
          "Hi [Name], congratulations on [update]. That is exciting to see. I hope the transition/project is going well, and I wanted to send a quick note to celebrate the news.",
      },
    ],
    customizationFields: [
      "[Name]",
      "[shared context/update]",
      "[their company/project]",
      "[short update]",
      "[resource/update]",
      "[topic/project]",
    ],
    nextActions: [
      "Update the contact record with the latest context.",
      "Set a low-pressure follow-up reminder.",
      "Do not make an ask unless the conversation naturally opens one.",
    ],
    usageNote:
      "Check-ins should feel human first. Keep them light, specific, and relationship-safe.",
    connectedTools: [
      {
        title: "Career CRM",
        description: "Use notes, relationship type, and follow-up dates to stay organized.",
        href: "/dashboard/contacts",
        iconKey: "contacts",
      },
      {
        title: "LinkedIn Optimizer",
        description: "Keep your profile clear before contacts look you up.",
        href: "/dashboard/linkedin",
        iconKey: "linkedin",
      },
    ],
    relatedPlaybookIds: ["referral-request", "follow-up-message"],
  },
]

export const NETWORKING_OUTREACH_WORKFLOW_LINKS: NetworkingOutreachWorkflowLink[] =
  [
    {
      title: "Manage Contacts",
      description: "Open your Career CRM to review people, notes, and follow-up dates.",
      href: "/dashboard/contacts",
      iconKey: "contacts",
    },
    {
      title: "Review Job Pipeline",
      description: "Use application status and next actions to decide who to message.",
      href: "/dashboard/jobs",
      iconKey: "pipeline",
    },
    {
      title: "Prepare LinkedIn",
      description: "Align your profile before outreach so contacts see a clear story.",
      href: "/dashboard/linkedin",
      iconKey: "linkedin",
    },
  ]
