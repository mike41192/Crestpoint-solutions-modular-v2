import type {
  ResumeBuilderFormData,
  ResumeTemplateType,
} from "@/modules/resume-builder"
import { buildResumePdfBuffer } from "@/modules/pdf-export"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const data = body.data as ResumeBuilderFormData
    const template = (body.template || "classic") as ResumeTemplateType

    if (!data) {
      return Response.json(
        { status: "error", message: "Resume data missing." },
        { status: 400 }
      )
    }

    const pdfBytes = await buildResumePdfBuffer(data, template)

    return new Response(pdfBytes as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="crestpoint-resume-${template}.pdf"`,
      },
    })
  } catch (error) {
    console.error("PDF export route error:", error)

    return Response.json(
      {
        status: "error",
        message: String(error),
      },
      { status: 500 }
    )
  }
}
