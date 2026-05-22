import { LockedModuleNotice } from "@/components/layout/LockedModuleNotice"
import { ModuleAccessBadge } from "@/components/layout/ModuleAccessBadge"
import { getModuleAccess } from "@/lib/access/getModuleAccess"
import { testUserConfig } from "@/lib/config/test-user.config"

const dashboardModules = [
  {
    moduleKey: "resume_builder",
    title: "Resume Builder",
    description: "Create, edit, optimize, and export professional resumes.",
    href: "/dashboard/resume",
  },
  {
    moduleKey: "ats_scoring",
    title: "ATS Scoring",
    description:
      "Compare your resume against job descriptions and improve keyword alignment.",
    href: "/dashboard/ats",
  },
  {
    moduleKey: "ai_interviewer",
    title: "AI Interviewer",
    description: "Practice mock interviews and get AI-powered feedback.",
    href: "/dashboard/interview",
  },
  {
    moduleKey: "interview_academy",
    title: "Interview Academy",
    description:
      "Watch interview prep videos and learn strategies to get hired.",
    href: "/dashboard/interview-academy",
  },
  {
    moduleKey: "linkedin_optimizer",
    title: "LinkedIn Optimizer",
    description:
      "Improve your LinkedIn headline, about section, and recruiter visibility.",
    href: "/dashboard/linkedin",
  },
  {
    moduleKey: "job_tracker",
    title: "Job Tracker",
    description: "Track applications, interviews, follow-ups, and offers.",
    href: "/dashboard/jobs",
  },
  {
    moduleKey: "networking_outreach",
    title: "Networking",
    description: "Create recruiter messages, referral requests, and follow-ups.",
    href: "/dashboard/networking",
  },
  {
    moduleKey: "analytics_dashboard",
    title: "Analytics",
    description:
      "View your career progress, readiness score, and activity insights.",
    href: "/dashboard/analytics",
  },
] as const

export default function DashboardPage() {
  return (
    <main style={{ padding: "32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
          Crestpoint Dashboard
        </h1>

        <p style={{ marginTop: "8px", color: "#64748b" }}>
          Your all-in-one career operating system for resumes, interviews, job
          tracking, and career growth.
        </p>

        <p style={{ marginTop: "8px", color: "#334155" }}>
          Current test tier:{" "}
          <strong style={{ textTransform: "capitalize" }}>
            {testUserConfig.tier}
          </strong>
        </p>
      </div>

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {dashboardModules.map((item) => {
          const { module, access } = getModuleAccess({
            userTier: testUserConfig.tier,
            moduleKey: item.moduleKey,
            isAdmin: testUserConfig.isAdmin,
          })

          if (!module) {
            return null
          }

          const cardContent = (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
                  {item.title}
                </h2>

                <ModuleAccessBadge tier={module.requiredTier} />
              </div>

              <p
                style={{
                  marginTop: "8px",
                  color: "#64748b",
                  lineHeight: 1.5,
                }}
              >
                {item.description}
              </p>

              {!access.allowed && (
                <LockedModuleNotice
                  requiredTier={module.requiredTier}
                  reason={access.reason}
                />
              )}
            </>
          )

          if (!access.allowed) {
            return (
              <div
                key={item.href}
                style={{
                  display: "block",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "20px",
                  background: "#f8fafc",
                  color: "inherit",
                  opacity: 0.9,
                }}
              >
                {cardContent}
              </div>
            )
          }

          return (
            <a
              key={item.href}
              href={item.href}
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
              {cardContent}
            </a>
          )
        })}
      </section>
    </main>
  )
}