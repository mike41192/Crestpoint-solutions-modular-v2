import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/layout/SectionCard"
import {
  getMissingGitHubEnvKeys,
  isGitHubConfigured,
} from "@/lib/github/github-env"

export default function GitHubStatusPage() {
  const missingKeys = getMissingGitHubEnvKeys()
  const configured = isGitHubConfigured()

  return (
    <main style={{ padding: "32px" }}>
      <PageHeader
        title="GitHub Repository Status"
        description="Review whether GitHub repository configuration is available."
      />

      <SectionCard>
        <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
          GitHub Configuration
        </h2>

        <p style={{ marginTop: "8px", color: configured ? "#166534" : "#991b1b" }}>
          Status: <strong>{configured ? "Configured" : "Missing Keys"}</strong>
        </p>

        {configured && (
          <p style={{ marginTop: "8px", color: "#64748b" }}>
            Repository: <code>{process.env.GITHUB_REPO}</code>
          </p>
        )}

        {!configured && (
          <ul style={{ marginTop: "12px", paddingLeft: "20px" }}>
            {missingKeys.map((key) => (
              <li key={key}>
                <code>{key}</code>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </main>
  )
}