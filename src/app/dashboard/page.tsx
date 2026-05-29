import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { SectionCard } from "@/components/layout/SectionCard"

const dashboardModules = [
  {
    title: "Resume Builder",
    description: "Build, optimize, and manage resumes with AI assistance.",
    href: "/dashboard/resume",
  },
  {
    title: "ATS Scoring",
    description:
      "Analyze resume compatibility against job descriptions and ATS systems.",
    href: "/dashboard/ats",
  },
  {
    title: "AI Interviewer",
    description:
      "Practice mock interviews with AI-generated questions and feedback.",
    href: "/dashboard/interview",
  },
  {
    title: "Interview Academy",
    description:
      "Learn interview strategy, STAR responses, confidence, and preparation systems.",
    href: "/dashboard/interview-academy",
  },
  {
    title: "LinkedIn Optimizer",
    description:
      "Improve LinkedIn profiles for recruiter visibility and conversions.",
    href: "/dashboard/linkedin",
  },
  {
    title: "Job Tracker",
    description:
      "Track applications, interviews, networking, and hiring pipeline progress.",
    href: "/dashboard/jobs",
  },
  {
    title: "Networking Outreach",
    description:
      "Generate recruiter outreach, networking scripts, and follow-up messaging.",
    href: "/dashboard/networking",
  },
  {
    title: "Analytics Dashboard",
    description:
      "Review application metrics, interview trends, AI usage, and platform analytics.",
    href: "/dashboard/analytics",
  },
  {
    title: "Billing",
    description:
      "Review membership access, subscription status, and billing details.",
    href: "/dashboard/billing",
  },
]

export default function DashboardHomePage() {
  return (
    <ModulePageLayout
      title="Career Dashboard"
      description="Access all Crestpoint career systems, AI modules, learning tools, and optimization engines."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {dashboardModules.map((module) => (
          <a
            key={module.href}
            href={module.href}
            className="block transition hover:-translate-y-1"
          >
            <SectionCard>
              <h2 className="text-xl font-bold">
                {module.title}
              </h2>

              <p className="mt-3 text-slate-600">
                {module.description}
              </p>
            </SectionCard>
          </a>
        ))}
      </div>
    </ModulePageLayout>
  )
}
