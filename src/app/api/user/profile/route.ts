import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { createSupabaseServerClient } from "@/lib/supabase/server"

type ProfileRecord = {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
  location: string | null
  linkedin_url: string | null
  website_url: string | null
}

const PROFILE_SELECT =
  "id, email, full_name, phone, location, linkedin_url, website_url"

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function mapProfileRecord(record: ProfileRecord | null, email: string) {
  return {
    fullName: record?.full_name || "",
    email,
    phone: record?.phone || "",
    location: record?.location || "",
    linkedIn: record?.linkedin_url || "",
    website: record?.website_url || "",
  }
}

async function getAuthenticatedUser() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return Response.json(
        {
          status: "unauthorized",
          message: "You must be signed in to load your profile.",
          profile: mapProfileRecord(null, ""),
        },
        { status: 401 },
      )
    }

    const supabase = createSupabaseAdminClient()

    const { data, error } = await supabase
      .from("profiles")
      .select(PROFILE_SELECT)
      .eq("id", user.id)
      .maybeSingle()

    if (error) {
      return Response.json(
        {
          status: "error",
          message: error.message,
          profile: mapProfileRecord(null, user.email || ""),
        },
        { status: 500 },
      )
    }

    return Response.json({
      status: "success",
      message: "Profile loaded.",
      profile: mapProfileRecord(data, user.email || ""),
    })
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Profile request failed.",
        profile: mapProfileRecord(null, ""),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return Response.json(
        {
          status: "unauthorized",
          message: "You must be signed in to update your profile.",
        },
        { status: 401 },
      )
    }

    const body = await request.json().catch(() => ({}))
    const profile = body?.profile || {}

    const supabase = createSupabaseAdminClient()

    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email || null,
        full_name: cleanText(profile.fullName),
        phone: cleanText(profile.phone),
        location: cleanText(profile.location),
        linkedin_url: cleanText(profile.linkedIn),
        website_url: cleanText(profile.website),
        updated_at: new Date().toISOString(),
      })
      .select(PROFILE_SELECT)
      .maybeSingle()

    if (error) {
      return Response.json(
        {
          status: "error",
          message: error.message,
        },
        { status: 500 },
      )
    }

    return Response.json({
      status: "success",
      message: "Profile saved successfully.",
      profile: mapProfileRecord(data, user.email || ""),
    })
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Profile update request failed.",
      },
      { status: 500 },
    )
  }
}
