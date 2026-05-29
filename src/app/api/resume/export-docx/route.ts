import { buildResumeDocxBuffer } from "@/modules/resume-builder/exporters/docx"
import type {
  ResumeBuilderFormData,
  ResumeTemplateType,
} from "@/modules/resume-builder"

function cleanFileName(value: string) {
  return value
    .replace(/[^a-z0-9\s-_]/gi, "")
    .replace(/\s+/g, "-")
    .toLowerCase()
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const resumeData = body?.resumeData as ResumeBuilderFormData | undefined
    const selectedTemplate = (body?.selectedTemplate ||
      "classic") as ResumeTemplateType

    if (!resumeData) {
      return Response.json(
        {
          status: "error",
          message: "Resume data is required.",
        },
        { status: 400 }
      )
    }

    const buffer = await buildResumeDocxBuffer(resumeData, selectedTemplate)
    const bytes = new Uint8Array(buffer)

    const fileName = `${cleanFileName(
      resumeData.contact.fullName || "resume"
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
      { status: 500 }
    )
  }
}

export async function GET() {
  return Response.json({
    status: "ok",
    route: "resume_export_docx",
  })
}
