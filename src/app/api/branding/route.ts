import {
  BRAND_SETTING_ID,
  defaultBrandSettings,
  normalizeBrandSettings,
} from "@/lib/branding/brand-config"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
}

export async function GET() {
  try {
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

    return Response.json(
      {
        status: "success",
        settings: data ? normalizeBrandSettings(data) : defaultBrandSettings,
      },
      { headers: NO_STORE_HEADERS },
    )
  } catch {
    return Response.json(
      {
        status: "success",
        settings: defaultBrandSettings,
      },
      { headers: NO_STORE_HEADERS },
    )
  }
}
