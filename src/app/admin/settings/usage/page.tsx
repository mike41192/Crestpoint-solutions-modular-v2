import { usageLimits } from "@/lib/config/limits.config"

function formatLimit(value: number) {
  return value === -1 ? "Unlimited" : value.toLocaleString()
}

export default function AdminUsageSettingsPage() {
  return (
    <main style={{ padding: "32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
          Usage Limit Settings
        </h1>

        <p style={{ marginTop: "8px", color: "#64748b" }}>
          Review usage limits by membership tier before live enforcement is connected.
        </p>
      </div>

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {usageLimits.map((limits) => (
          <div
            key={limits.tier}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "20px",
              background: "#ffffff",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 700,
                textTransform: "capitalize",
              }}
            >
              {limits.tier}
            </h2>

            <dl style={{ marginTop: "16px", display: "grid", gap: "10px" }}>
              <div>
                <dt style={{ color: "#64748b", fontSize: "13px" }}>
                  AI Credits / Month
                </dt>
                <dd>{formatLimit(limits.aiCreditsPerMonth)}</dd>
              </div>

              <div>
                <dt style={{ color: "#64748b", fontSize: "13px" }}>
                  Resume Uploads / Month
                </dt>
                <dd>{formatLimit(limits.resumeUploadsPerMonth)}</dd>
              </div>

              <div>
                <dt style={{ color: "#64748b", fontSize: "13px" }}>
                  Resume Exports / Month
                </dt>
                <dd>{formatLimit(limits.resumeExportsPerMonth)}</dd>
              </div>

              <div>
                <dt style={{ color: "#64748b", fontSize: "13px" }}>
                  ATS Scans / Month
                </dt>
                <dd>{formatLimit(limits.atsScansPerMonth)}</dd>
              </div>

              <div>
                <dt style={{ color: "#64748b", fontSize: "13px" }}>
                  Mock Interviews / Month
                </dt>
                <dd>{formatLimit(limits.mockInterviewsPerMonth)}</dd>
              </div>

              <div>
                <dt style={{ color: "#64748b", fontSize: "13px" }}>
                  Tracked Jobs
                </dt>
                <dd>{formatLimit(limits.trackedJobs)}</dd>
              </div>
            </dl>
          </div>
        ))}
      </section>
    </main>
  )
}
