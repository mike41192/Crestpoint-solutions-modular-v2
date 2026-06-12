import { revalidatePath } from "next/cache"

import { requireAdminUser } from "@/lib/security/admin-auth"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { getAIQualitySummary } from "@/modules/ai-learning"

async function updateSuggestionStatus(formData: FormData) {
  "use server"

  const admin = await requireAdminUser()

  if (admin.ok === false) {
    return
  }

  const suggestionId = String(formData.get("suggestionId") || "")
  const status = String(formData.get("status") || "")

  if (
    !suggestionId ||
    !["approved", "rejected", "applied"].includes(status)
  ) {
    return
  }

  const now = new Date().toISOString()
  const supabase = createSupabaseAdminClient()

  await supabase
    .from("ai_prompt_improvement_suggestions")
    .update({
      status,
      reviewed_at: now,
      applied_at: status === "applied" ? now : null,
      reviewer_note: `Reviewed by ${admin.email || "admin"}`,
    })
    .eq("id", suggestionId)

  revalidatePath("/admin/ai-quality")
}

function formatValue(value: number | null) {
  return value === null ? "n/a" : String(value)
}

function statusColor(status: string) {
  if (status === "approved" || status === "applied") {
    return {
      background: "#dcfce7",
      color: "#166534",
    }
  }

  if (status === "rejected") {
    return {
      background: "#fee2e2",
      color: "#991b1b",
    }
  }

  return {
    background: "#fef3c7",
    color: "#92400e",
  }
}

function severityColor(severity: string) {
  if (severity === "positive") {
    return {
      background: "#dcfce7",
      color: "#166534",
    }
  }

  if (severity === "critical") {
    return {
      background: "#fee2e2",
      color: "#991b1b",
    }
  }

  if (severity === "needs_review") {
    return {
      background: "#fef3c7",
      color: "#92400e",
    }
  }

  return {
    background: "#e0f2fe",
    color: "#075985",
  }
}

export default async function AdminAIQualityPage() {
  const admin = await requireAdminUser()

  if (admin.ok === false) {
    return (
      <main style={{ padding: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
          AI Quality Center
        </h1>
        <p style={{ marginTop: "8px", color: "#64748b" }}>
          Admin access is required to review AI learning signals.
        </p>
      </main>
    )
  }

  let summary = null
  let setupError = ""

  try {
    summary = await getAIQualitySummary()
  } catch (error) {
    setupError =
      error instanceof Error
        ? error.message
        : "AI learning tables are not available yet."
  }

  return (
    <main style={{ padding: "32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <p
          style={{
            color: "#2563eb",
            fontSize: "12px",
            fontWeight: 900,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Continuous Learning
        </p>

        <h1 style={{ fontSize: "32px", fontWeight: 800, marginTop: "8px" }}>
          AI Quality Center
        </h1>

        <p style={{ marginTop: "8px", color: "#64748b", lineHeight: 1.6 }}>
          Review AI output quality, user feedback, generated improvement
          suggestions, and approved guidance that can be reused by live prompts.
        </p>
      </div>

      {setupError && (
        <section
          style={{
            border: "1px solid #f59e0b",
            borderRadius: "20px",
            background: "#fffbeb",
            padding: "20px",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ color: "#92400e", fontSize: "18px", fontWeight: 800 }}>
            Learning tables need setup
          </h2>
          <p style={{ color: "#92400e", lineHeight: 1.6, marginTop: "8px" }}>
            Run `supabase/migrations/202606120001_ai_learning_feedback_loop.sql`
            in Supabase to enable persistent AI learning events and prompt
            improvement suggestions. Current error: {setupError}
          </p>
        </section>
      )}

      {summary && (
        <>
          <section
            style={{
              display: "grid",
              gap: "16px",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              marginBottom: "24px",
            }}
          >
            <MetricCard label="Learning Events" value={summary.totalEvents} />
            <MetricCard label="Positive Signals" value={summary.positiveEvents} />
            <MetricCard
              label="Needs Review"
              value={summary.needsReviewEvents + summary.criticalEvents}
            />
            <MetricCard
              label="Avg Rating"
              value={formatValue(summary.averageRating)}
            />
            <MetricCard
              label="Avg Score"
              value={formatValue(summary.averageScore)}
            />
            <MetricCard
              label="Pending Suggestions"
              value={summary.pendingSuggestions}
            />
            <MetricCard
              label="Approved Guidance"
              value={summary.approvedGuidance}
            />
          </section>

          <section
            style={{
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            }}
          >
            <Panel title="Recent Learning Signals">
              {summary.recentEvents.length === 0 ? (
                <EmptyText>
                  No learning events have been recorded yet. Interview
                  questions, evaluations, and user feedback will appear here.
                </EmptyText>
              ) : (
                <div style={{ display: "grid", gap: "12px" }}>
                  {summary.recentEvents.map((event) => (
                    <article
                      key={event.id}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        padding: "14px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "12px",
                        }}
                      >
                        <strong style={{ color: "#0f172a" }}>
                          {event.module_key} / {event.feature_key}
                        </strong>
                        <span
                          style={{
                            ...severityColor(event.severity),
                            borderRadius: "999px",
                            fontSize: "11px",
                            fontWeight: 900,
                            padding: "4px 8px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {event.severity}
                        </span>
                      </div>
                      <p
                        style={{
                          color: "#475569",
                          fontSize: "13px",
                          lineHeight: 1.5,
                          marginTop: "8px",
                        }}
                      >
                        {event.output_summary ||
                          event.input_summary ||
                          event.event_type}
                      </p>
                      <p
                        style={{
                          color: "#64748b",
                          fontSize: "12px",
                          marginTop: "8px",
                        }}
                      >
                        Rating {formatValue(event.user_rating)} · Score{" "}
                        {formatValue(event.score)}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </Panel>

            <Panel title="Prompt Improvement Suggestions">
              {summary.suggestions.length === 0 ? (
                <EmptyText>
                  No suggestions yet. Low-rated or low-scored events will create
                  pending prompt guidance for review.
                </EmptyText>
              ) : (
                <div style={{ display: "grid", gap: "12px" }}>
                  {summary.suggestions.map((suggestion) => (
                    <article
                      key={suggestion.id}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        padding: "14px",
                        background: "#ffffff",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "12px",
                        }}
                      >
                        <strong style={{ color: "#0f172a" }}>
                          {suggestion.title}
                        </strong>
                        <span
                          style={{
                            ...statusColor(suggestion.status),
                            borderRadius: "999px",
                            fontSize: "11px",
                            fontWeight: 900,
                            padding: "4px 8px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {suggestion.status}
                        </span>
                      </div>
                      <p
                        style={{
                          color: "#475569",
                          fontSize: "13px",
                          lineHeight: 1.5,
                          marginTop: "8px",
                        }}
                      >
                        {suggestion.prompt_guidance}
                      </p>
                      <p
                        style={{
                          color: "#64748b",
                          fontSize: "12px",
                          marginTop: "8px",
                        }}
                      >
                        Priority {suggestion.priority} · {suggestion.module_key} /{" "}
                        {suggestion.feature_key}
                      </p>
                      {suggestion.status === "pending" && (
                        <form
                          action={updateSuggestionStatus}
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                            marginTop: "12px",
                          }}
                        >
                          <input
                            type="hidden"
                            name="suggestionId"
                            value={suggestion.id}
                          />
                          <ReviewButton status="approved" label="Approve" />
                          <ReviewButton status="applied" label="Apply" />
                          <ReviewButton status="rejected" label="Reject" />
                        </form>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </Panel>
          </section>
        </>
      )}
    </main>
  )
}

function MetricCard({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <article
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "18px",
        background: "#ffffff",
        padding: "16px",
      }}
    >
      <p
        style={{
          color: "#64748b",
          fontSize: "11px",
          fontWeight: 900,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
      <p style={{ color: "#0f172a", fontSize: "30px", fontWeight: 900 }}>
        {value}
      </p>
    </article>
  )
}

function Panel({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "22px",
        background: "#ffffff",
        padding: "20px",
      }}
    >
      <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: 800 }}>
        {title}
      </h2>
      <div style={{ marginTop: "16px" }}>{children}</div>
    </section>
  )
}

function EmptyText({ children }: { children: React.ReactNode }) {
  return <p style={{ color: "#64748b", lineHeight: 1.6 }}>{children}</p>
}

function ReviewButton({ status, label }: { status: string; label: string }) {
  return (
    <button
      type="submit"
      name="status"
      value={status}
      style={{
        border: "1px solid #cbd5e1",
        borderRadius: "999px",
        background: "#f8fafc",
        color: "#0f172a",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: 900,
        padding: "8px 12px",
      }}
    >
      {label}
    </button>
  )
}
