import {
  BRAND_ASSETS_BUCKET,
  assetFileName,
} from "@/lib/branding/brand-config"
import { requireAdminUser } from "@/lib/security/admin-auth"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
}

const MAX_FILE_SIZE = 10 * 1024 * 1024

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
  "application/pdf": "pdf",
}

function cleanAssetType(value: FormDataEntryValue | null) {
  return value === "favicon" ? "favicon" : "logo"
}

function cleanFileName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

export async function POST(request: Request) {
  const admin = await requireAdminUser()

  if (!admin.ok) {
    return admin.response
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file")
    const assetType = cleanAssetType(formData.get("assetType"))

    if (!(file instanceof File)) {
      return Response.json(
        {
          status: "error",
          message: "A file is required.",
        },
        { status: 400, headers: NO_STORE_HEADERS },
      )
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return Response.json(
        {
          status: "error",
          message: "Brand uploads must be between 1 byte and 10 MB.",
        },
        { status: 400, headers: NO_STORE_HEADERS },
      )
    }

    const extension = ALLOWED_TYPES[file.type]

    if (!extension) {
      return Response.json(
        {
          status: "error",
          message:
            "Upload a PNG, JPG, WEBP, GIF, SVG, ICO, or PDF brand asset.",
        },
        { status: 400, headers: NO_STORE_HEADERS },
      )
    }

    const supabase = createSupabaseAdminClient()
    const originalName = cleanFileName(assetFileName(file.name)) || `${assetType}.${extension}`
    const baseName = originalName.replace(/\.[a-z0-9]+$/i, "")
    const path = `${assetType}/${Date.now()}-${crypto.randomUUID()}-${baseName}.${extension}`
    const arrayBuffer = await file.arrayBuffer()

    const { error } = await supabase.storage
      .from(BRAND_ASSETS_BUCKET)
      .upload(path, arrayBuffer, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      throw new Error(error.message)
    }

    const { data } = supabase.storage.from(BRAND_ASSETS_BUCKET).getPublicUrl(path)

    return Response.json(
      {
        status: "success",
        message: "Brand asset uploaded.",
        assetType,
        fileName: file.name,
        contentType: file.type,
        publicUrl: data.publicUrl,
      },
      { headers: NO_STORE_HEADERS },
    )
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Brand asset upload failed.",
      },
      { status: 500, headers: NO_STORE_HEADERS },
    )
  }
}
