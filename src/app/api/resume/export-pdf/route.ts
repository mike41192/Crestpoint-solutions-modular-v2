// =====================================================
// BLOCK: Supabase Server Imports
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: PDF Export Imports
// =====================================================

import type {
  ResumeBuilderFormData,
  ResumeTemplateType,
} from "@/modules/resume-builder"
import { buildResumePdfBuffer } from "@/modules/pdf-export"

// =====================================================
// BLOCK: Runtime Config
// =====================================================

export const runtime = "nodejs"

// =====================================================
// BLOCK: Constants
// =====================================================

const ALLOWED_RESUME_TEMPLATES = new Set([
  "classic",
  "modern",
  "executive",
  "ats",
])

// =====================================================
// BLOCK: Helpers
// =====================================================

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function getSelectedTemplate(value: unknown): ResumeTemplateType {
  if (typeof value !== "string") {
    return "classic"
  }

  if (ALLOWED_RESUME_TEMPLATES.has(value)) {
    return value as ResumeTemplateType
  }

  return "classic"
}

// =====================================================
// BLOCK: PDF Export Route
// =====================================================

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return Response.json(
        {
          status: "unauthorized",
          message: "You must be signed in to export resumes.",
        },
        { status: 401 },
      )
    }

    const body = await request.json()

    const data = body?.data as ResumeBuilderFormData | undefined
    const template = getSelectedTemplate(body?.template)

    if (!data || !isRecord(data)) {
      return Response.json(
        {
          status: "error",
          message: "Valid resume data is required.",
        },
        { status: 400 },
      )
    }

    const pdfBytes = await buildResumePdfBuffer(data, template)

    return new Response(pdfBytes as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="crestpoint-resume-${template}.pdf"`,
      },
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "PDF export failed.",
      },
      { status: 500 },
    )
  }
}
