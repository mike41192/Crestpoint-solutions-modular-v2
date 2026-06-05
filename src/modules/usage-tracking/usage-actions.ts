// =====================================================
// BLOCK: Usage Action Types
// Crestpoint Solutions V2
// Version: 1.7.14
// =====================================================

type UsageColumn =
  | "ats_scans_used"
  | "ai_rewrites_used"
  | "resumes_created"

type UsageActionResult = {
  status: "success" | "error"
  message: string
}

// =====================================================
// BLOCK: Server Usage Increment Helper
// =====================================================

async function incrementUsageColumn(
  column: UsageColumn,
): Promise<UsageActionResult> {
  try {
    const response = await fetch("/api/user/usage/increment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        column,
      }),
    })

    const result = await response.json()

    if (!response.ok || result.status !== "success") {
      return {
        status: "error",
        message: result.message || "Usage update failed.",
      }
    }

    return {
      status: "success",
      message: result.message || "Usage updated.",
    }
  } catch {
    return {
      status: "error",
      message: "Usage update request failed.",
    }
  }
}

// =====================================================
// BLOCK: Public Usage Actions
// =====================================================

export function incrementATSScan() {
  return incrementUsageColumn("ats_scans_used")
}

export function incrementAIRewrite() {
  return incrementUsageColumn("ai_rewrites_used")
}

export function incrementResumeCreated() {
  return incrementUsageColumn("resumes_created")
}