const dashboardModules = [
  {
    title: "Resume Builder",
    description: "Create, edit, optimize, and export professional resumes.",
    href: "/dashboard/resume",
  },
  {
    title: "ATS Scoring",
    description: "Compare your resume against job descriptions and improve keyword alignment.",
    href: "/dashboard/ats",
  },
  {
    title: "AI Interviewer",
    description: "Practice mock interviews and get AI-powered feedback.",
    href: "/dashboard/interview",
  },
  {
    title: "Interview Academy",
    description: "Watch interview prep videos and learn strategies to get hired.",
    href: "/dashboard/interview-academy",
  },
  {
    title: "LinkedIn Optimizer",
    description: "Improve your LinkedIn headline, about section, and recruiter visibility.",
    href: "/dashboard/linkedin",
  },
  {
    title: "Job Tracker",
    description: "Track applications, interviews, follow-ups, and offers.",
    href: "/dashboard/jobs",
  },
  {
    title: "Networking",
    description: "Create recruiter messages, referral requests, and follow-ups.",
    href: "/dashboard/networking",
  },
  {
    title: "Analytics",
    description: "View your career progress, readiness score, and activity insights.",
    href: "/dashboard/analytics",
  },
]

export default function DashboardPage() {
  return (
    <main style={{ padding: "32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
          Crestpoint Dashboard
        </h1>

        <p style={{ marginTop: "8px", color: "#64748b" }}>
          Your all-in-one career operating system for resumes, interviews, job tracking, and career growth.
        </p>
      </div>

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
              display: "block",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "20px",
              background: "#ffffff",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
              {module.title}
            </h2>

            <p style={{ marginTop: "8px", color: "#64748b", lineHeight: 1.5 }}>
              {module.description}
            </p>
          </a>
        ))}
      </section>
    </main>
  )
}