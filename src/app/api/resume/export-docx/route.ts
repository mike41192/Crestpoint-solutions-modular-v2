// =====================================================
// BLOCK: Supabase Server Imports
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server"

// =====================================================
// BLOCK: DOCX Export Imports
// =====================================================

import { buildResumeDocxBuffer } from "@/modules/resume-builder/exporters/docx"
import type {
  ResumeBuilderFormData,
  ResumeTemplateType,
} from "@/modules/resume-builder"

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

function cleanFileName(value: string) {
  return value
    .replace(/[^a-z0-9\s-_]/gi, "")
    .replace(/\s+/g, "-")
    .toLowerCase()
}

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
// BLOCK: DOCX Export Route
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

    const resumeData = body?.resumeData as ResumeBuilderFormData | undefined
    const selectedTemplate = getSelectedTemplate(body?.selectedTemplate)

    if (!resumeData || !isRecord(resumeData)) {
      return Response.json(
        {
          status: "error",
          message: "Valid resume data is required.",
        },
        { status: 400 },
      )
    }

    const buffer = await buildResumeDocxBuffer(resumeData, selectedTemplate)
    const bytes = new Uint8Array(buffer)

    const fileName = `${cleanFileName(
      resumeData.contact?.fullName || "resume",
    )}-${selectedTemplate}.docx`

    return new Response(bytes, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    })
  } catch {
    return Response.json(
      {
        status: "error",
        message: "DOCX export failed.",
      },
      { status: 500 },
    )
  }
}
