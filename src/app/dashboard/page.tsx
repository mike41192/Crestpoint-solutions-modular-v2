import { PageHeader } from "@/components/layout/PageHeader"
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
    title: "Account Settings",
    description:
      "Manage profile, membership access, preferences, and account controls.",
    href: "/dashboard/settings",
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
    <main style={{ padding: "32px" }}>
      <PageHeader
        title="Career Dashboard"
        description="Access all Crestpoint career systems, AI modules, learning tools, and optimization engines."
      />

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {dashboardModules.map((module) => (
          <a
            key={module.href}
            href={module.href}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <SectionCard>
              <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
                {module.title}
              </h2>

              <p
                style={{
                  marginTop: "8px",
                  color: "#64748b",
                  lineHeight: 1.5,
                }}
              >
                {module.description}
              </p>
            </SectionCard>
          </a>
        ))}
      </section>
    </main>
  )
}
