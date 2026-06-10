// =====================================================
// BLOCK: Next / Supabase Imports
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { createHash } from "crypto"

import { isConfiguredAdminEmail } from "@/lib/security/admin-auth"

// =====================================================
// BLOCK: Types
// =====================================================

type CookieWrite = {
  name: string
  value: string
  options: Parameters<NextResponse["cookies"]["set"]>[2]
}

// =====================================================
// BLOCK: Helpers
// =====================================================

function cleanRedirectPath(value: unknown) {
  if (typeof value !== "string") {
    return "/dashboard"
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard"
  }

  return value
}

function redirectWithCookies(
  request: NextRequest,
  path: string,
  cookieWrites: CookieWrite[],
) {
  const response = NextResponse.redirect(new URL(path, request.url))

  cookieWrites.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options)
  })

  return response
}

function redirectToLogin(
  request: NextRequest,
  message: string,
  path = "/auth/login",
) {
  const url = new URL(path, request.url)

  url.searchParams.set("message", message)

  return NextResponse.redirect(url)
}

function buildMfaRedirectPath(redirectTo: string) {
  const params = new URLSearchParams({
    redirectTo,
  })

  return `/auth/mfa?${params.toString()}`
}

function getHeaderValue(request: NextRequest, name: string) {
  return request.headers.get(name) || ""
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

function getClientIp(request: NextRequest) {
  const forwardedFor = getHeaderValue(request, "x-forwarded-for")

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || ""
  }

  return getHeaderValue(request, "x-real-ip")
}

function getDeviceType(userAgent: string) {
  const normalized = userAgent.toLowerCase()

  if (/iphone|android.*mobile|windows phone/.test(normalized)) {
    return "mobile"
  }

  if (/ipad|tablet|android/.test(normalized)) {
    return "tablet"
  }

  return "desktop"
}

function getBrowser(userAgent: string) {
  if (userAgent.includes("Edg/")) return "Microsoft Edge"
  if (userAgent.includes("Chrome/")) return "Chrome"
  if (userAgent.includes("Safari/") && !userAgent.includes("Chrome/")) {
    return "Safari"
  }
  if (userAgent.includes("Firefox/")) return "Firefox"

  return "Unknown Browser"
}

function getOperatingSystem(userAgent: string) {
  if (userAgent.includes("Windows")) return "Windows"
  if (userAgent.includes("Mac OS X")) return "macOS"
  if (userAgent.includes("iPhone") || userAgent.includes("iPad")) return "iOS"
  if (userAgent.includes("Android")) return "Android"
  if (userAgent.includes("Linux")) return "Linux"

  return "Unknown OS"
}

async function registerAuthenticatedSession({
  supabase,
  request,
  userId,
}: {
  supabase: ReturnType<typeof createServerClient>
  request: NextRequest
  userId: string
}) {
  const userAgent = getHeaderValue(request, "user-agent")
  const clientIp = getClientIp(request)
  const fingerprintSource = `${userId}:${userAgent}:${clientIp}`
  const deviceFingerprintHash = hashValue(fingerprintSource)
  const browser = getBrowser(userAgent)
  const operatingSystem = getOperatingSystem(userAgent)
  const deviceType = getDeviceType(userAgent)
  const deviceLabel = `${browser} on ${operatingSystem}`
  const now = new Date().toISOString()

  const { data: existingSession, error: existingSessionError } = await supabase
    .from("authenticated_sessions")
    .select("id")
    .eq("user_id", userId)
    .eq("device_fingerprint_hash", deviceFingerprintHash)
    .maybeSingle()

  if (existingSessionError) {
    return existingSessionError
  }

  if (existingSession?.id) {
    const { error } = await supabase
      .from("authenticated_sessions")
      .update({
        device_label: deviceLabel,
        device_type: deviceType,
        browser,
        operating_system: operatingSystem,
        user_agent: userAgent,
        ip_hash: clientIp ? hashValue(clientIp) : null,
        last_seen_at: now,
        revoked_at: null,
      })
      .eq("id", existingSession.id)
      .eq("user_id", userId)

    return error
  }

  const { error } = await supabase.from("authenticated_sessions").insert({
      user_id: userId,
      device_label: deviceLabel,
      device_type: deviceType,
      browser,
      operating_system: operatingSystem,
      user_agent: userAgent,
      ip_hash: clientIp ? hashValue(clientIp) : null,
      device_fingerprint_hash: deviceFingerprintHash,
      last_seen_at: now,
      revoked_at: null,
  })

  return error
}

// =====================================================
// BLOCK: Login Route
// =====================================================

export async function POST(request: NextRequest) {
  const cookieWrites: CookieWrite[] = []

  try {
    const formData = await request.formData()
    const email = String(formData.get("email") || "").trim()
    const password = String(formData.get("password") || "")
    const redirectTo = cleanRedirectPath(formData.get("redirectTo"))
    const isAdminLogin = String(formData.get("adminLogin") || "") === "true"
    const loginPath = isAdminLogin ? "/admin/login" : "/auth/login"

    if (!email || !password) {
      return redirectToLogin(
        request,
        "Email and password are required.",
        loginPath,
      )
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieWrites.push({
                name,
                value,
                options,
              })
            })
          },
        },
      },
    )

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirectToLogin(request, error.message, loginPath)
    }

    if (!data.session) {
      return redirectToLogin(
        request,
        "Sign in completed, but no active session was returned.",
        loginPath,
      )
    }

    if (isAdminLogin && !isConfiguredAdminEmail(data.session.user.email)) {
      await supabase.auth.signOut()

      return redirectWithCookies(
        request,
        "/admin/login?message=Admin access is not enabled for this account.",
        cookieWrites,
      )
    }

    const { data: aalData, error: aalError } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

    if (aalError) {
      return redirectToLogin(request, aalError.message, loginPath)
    }

    const sessionRegistrationError = await registerAuthenticatedSession({
      supabase,
      request,
      userId: data.session.user.id,
    })

    if (sessionRegistrationError) {
      return redirectToLogin(
        request,
        `Sign in succeeded, but device tracking failed: ${sessionRegistrationError.message}`,
        loginPath,
      )
    }

    if (
      aalData?.nextLevel === "aal2" &&
      aalData.currentLevel !== aalData.nextLevel
    ) {
      return redirectWithCookies(
        request,
        buildMfaRedirectPath(redirectTo),
        cookieWrites,
      )
    }

    return redirectWithCookies(request, redirectTo, cookieWrites)
  } catch {
    return redirectToLogin(request, "Login request failed.")
  }
}
