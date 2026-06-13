import {
  BRAND_SETTING_ID,
  defaultBrandSettings,
  normalizeBrandSettings,
  toBrandSettingsRow,
} from "@/lib/branding/brand-config"
import { requireAdminUser } from "@/lib/security/admin-auth"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
}

async function loadBrandSettings() {
  const supabase = createSupabaseAdminClient()

  const { data, error } = await supabase
    .from("brand_settings")
    .select(
      "brand_name, short_name, tagline, logo_url, favicon_url, primary_color, updated_at",
    )
    .eq("id", BRAND_SETTING_ID)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data ? normalizeBrandSettings(data) : defaultBrandSettings
}

export async function GET() {
  const admin = await requireAdminUser()

  if (!admin.ok) {
    return admin.response
  }

  try {
    const settings = await loadBrandSettings()

    return Response.json(
      {
        status: "success",
        settings,
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
            : "Brand settings could not be loaded.",
        settings: defaultBrandSettings,
      },
      { status: 500, headers: NO_STORE_HEADERS },
    )
  }
}

export async function POST(request: Request) {
  const admin = await requireAdminUser()

  if (!admin.ok) {
    return admin.response
  }

  try {
    const body = await request.json().catch(() => ({}))
    const settings = normalizeBrandSettings(body?.settings ?? body)
    const supabase = createSupabaseAdminClient()

    const { error } = await supabase
      .from("brand_settings")
      .upsert(toBrandSettingsRow(settings, admin.email), { onConflict: "id" })

    if (error) {
      throw new Error(error.message)
    }

    const savedSettings = await loadBrandSettings()

    return Response.json(
      {
        status: "success",
        message: "Brand settings saved.",
        settings: savedSettings,
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
            : "Brand settings could not be saved.",
      },
      { status: 500, headers: NO_STORE_HEADERS },
    )
  }
}
