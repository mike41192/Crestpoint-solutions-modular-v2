import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/layout/SectionCard"
import {
  getMissingOpenAIEnvKeys,
  isOpenAIConfigured,
} from "@/lib/ai/openai-env"
import {
  getMissingAppEnvKeys,
  isAppEnvConfigured,
} from "@/lib/config/app-env"
import {
  getMissingGitHubEnvKeys,
  isGitHubConfigured,
} from "@/lib/github/github-env"
import {
  getMissingStripeEnvKeys,
  isStripeConfigured,
} from "@/lib/stripe/stripe-env"
import {
  getMissingSupabaseEnvKeys,
  isSupabaseConfigured,
} from "@/lib/supabase/supabase-env"
import {
  getMissingVercelEnvKeys,
  isVercelConfigured,
} from "@/lib/vercel/vercel-env"

export default function SystemStatusPage() {
  const appConfigured = isAppEnvConfigured()
  const supabaseConfigured = isSupabaseConfigured()
  const stripeConfigured = isStripeConfigured()
  const openAIConfigured = isOpenAIConfigured()
  const vercelConfigured = isVercelConfigured()
  const githubConfigured = isGitHubConfigured()

  const missingAppKeys = getMissingAppEnvKeys()
  const missingSupabaseKeys = getMissingSupabaseEnvKeys()
  const missingStripeKeys = getMissingStripeEnvKeys()
  const missingOpenAIKeys = getMissingOpenAIEnvKeys()
  const missingVercelKeys = getMissingVercelEnvKeys()
  const missingGitHubKeys = getMissingGitHubEnvKeys()

  return (
    <main style={{ padding: "32px" }}>
      <PageHeader
        title="System Status"
        description="Review platform readiness for application setup, database, billing, AI, deployment, source control, module gating, and tutorials."
      />

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        <SectionCard>
          <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
            Application Environment
          </h2>

          <p
            style={{
              marginTop: "8px",
              color: appConfigured ? "#166534" : "#991b1b",
            }}
          >
            Status:{" "}
            <strong>
              {appConfigured ? "Configured" : "Missing Configuration"}
            </strong>
          </p>

          {!appConfigured && (
            <p style={{ marginTop: "8px", color: "#64748b" }}>
              Missing keys: {missingAppKeys.length}
            </p>
          )}
        </SectionCard>

        <SectionCard>
          <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
            Supabase Database
          </h2>

          <p
            style={{
              marginTop: "8px",
              color: supabaseConfigured ? "#166534" : "#991b1b",
            }}
          >
            Status:{" "}
            <strong>
              {supabaseConfigured ? "Configured" : "Missing Configuration"}
            </strong>
          </p>

          {!supabaseConfigured && (
            <p style={{ marginTop: "8px", color: "#64748b" }}>
              Missing keys: {missingSupabaseKeys.length}
            </p>
          )}
        </SectionCard>

        <SectionCard>
          <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
            Stripe Billing
          </h2>

          <p
            style={{
              marginTop: "8px",
              color: stripeConfigured ? "#166534" : "#991b1b",
            }}
          >
            Status:{" "}
            <strong>
              {stripeConfigured ? "Configured" : "Missing Configuration"}
            </strong>
          </p>

          {!stripeConfigured && (
            <p style={{ marginTop: "8px", color: "#64748b" }}>
              Missing keys: {missingStripeKeys.length}
            </p>
          )}
        </SectionCard>

        <SectionCard>
          <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
            OpenAI / AI System
          </h2>

          <p
            style={{
              marginTop: "8px",
              color: openAIConfigured ? "#166534" : "#991b1b",
            }}
          >
            Status:{" "}
            <strong>
              {openAIConfigured ? "Configured" : "Missing Configuration"}
            </strong>
          </p>

          {!openAIConfigured && (
            <p style={{ marginTop: "8px", color: "#64748b" }}>
              Missing keys: {missingOpenAIKeys.length}
            </p>
          )}
        </SectionCard>

        <SectionCard>
          <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
            Vercel Deployment
          </h2>

          <p
            style={{
              marginTop: "8px",
              color: vercelConfigured ? "#166534" : "#991b1b",
            }}
          >
            Status:{" "}
            <strong>
              {vercelConfigured ? "Configured" : "Missing Configuration"}
            </strong>
          </p>

          {!vercelConfigured && (
            <p style={{ marginTop: "8px", color: "#64748b" }}>
              Missing keys: {missingVercelKeys.length}
            </p>
          )}
        </SectionCard>

        <SectionCard>
          <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
            GitHub Repository
          </h2>

          <p
            style={{
              marginTop: "8px",
              color: githubConfigured ? "#166534" : "#991b1b",
            }}
          >
            Status:{" "}
            <strong>
              {githubConfigured ? "Configured" : "Missing Configuration"}
            </strong>
          </p>

          {!githubConfigured && (
            <p style={{ marginTop: "8px", color: "#64748b" }}>
              Missing keys: {missingGitHubKeys.length}
            </p>
          )}
        </SectionCard>

        <SectionCard>
          <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
            Module Gating
          </h2>

          <p style={{ marginTop: "8px", color: "#166534" }}>
            Status: <strong>Active</strong>
          </p>

          <p style={{ marginTop: "8px", color: "#64748b" }}>
            Dashboard module access rules are enforced through the centralized
            module access engine.
          </p>
        </SectionCard>

        <SectionCard>
          <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
            Tutorial System
          </h2>

          <p style={{ marginTop: "8px", color: "#166534" }}>
            Status: <strong>Active</strong>
          </p>

          <p style={{ marginTop: "8px", color: "#64748b" }}>
            First-use tutorial content is connected to dashboard modules.
          </p>
        </SectionCard>
      </section>
    </main>
  )
}