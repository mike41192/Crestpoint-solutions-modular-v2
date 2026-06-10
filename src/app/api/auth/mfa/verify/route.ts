// =====================================================
// BLOCK: Next / Supabase Imports
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

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

function buildMfaRedirectPath(redirectTo: string, message: string) {
  const params = new URLSearchParams({
    redirectTo,
    message,
  })

  return `/auth/mfa?${params.toString()}`
}

function buildLoginRedirectPath(redirectTo: string, message: string) {
  const params = new URLSearchParams({
    message,
  })

  const loginPath = redirectTo.startsWith("/admin")
    ? "/admin/login"
    : "/auth/login"

  return `${loginPath}?${params.toString()}`
}

// =====================================================
// BLOCK: MFA Verify Route
// =====================================================

export async function POST(request: NextRequest) {
  const cookieWrites: CookieWrite[] = []

  try {
    const formData = await request.formData()
    const redirectTo = cleanRedirectPath(formData.get("redirectTo"))
    const code = String(formData.get("totpCode") || "").replace(/\D/g, "")

    if (code.length !== 6) {
      return NextResponse.redirect(
        new URL(
          buildMfaRedirectPath(
            redirectTo,
            "Enter your 6-digit authenticator code.",
          ),
          request.url,
        ),
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

    const { data: factorsData, error: factorsError } =
      await supabase.auth.mfa.listFactors()

    if (factorsError) {
      if (factorsError.message.toLowerCase().includes("session")) {
        return redirectWithCookies(
          request,
          buildLoginRedirectPath(
            redirectTo,
            "Sign in again to continue MFA verification.",
          ),
          cookieWrites,
        )
      }

      return redirectWithCookies(
        request,
        buildMfaRedirectPath(redirectTo, factorsError.message),
        cookieWrites,
      )
    }

    const verifiedTotp = factorsData.totp.find((factor) => {
      return factor.status === "verified"
    })

    if (!verifiedTotp) {
      return redirectWithCookies(
        request,
        buildMfaRedirectPath(
          redirectTo,
          "No verified authenticator app is enabled for this account.",
        ),
        cookieWrites,
      )
    }

    const { data, error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: verifiedTotp.id,
      code,
    })

    if (error) {
      return redirectWithCookies(
        request,
        buildMfaRedirectPath(redirectTo, error.message),
        cookieWrites,
      )
    }

    if (!data?.access_token || !data.refresh_token) {
      return redirectWithCookies(
        request,
        buildMfaRedirectPath(
          redirectTo,
          "MFA verification succeeded, but no upgraded session was returned.",
        ),
        cookieWrites,
      )
    }

    const { error: sessionError } = await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    })

    if (sessionError) {
      return redirectWithCookies(
        request,
        buildMfaRedirectPath(redirectTo, sessionError.message),
        cookieWrites,
      )
    }

    return redirectWithCookies(request, redirectTo, cookieWrites)
  } catch {
    return NextResponse.redirect(
      new URL(
        buildMfaRedirectPath("/dashboard", "MFA verification request failed."),
        request.url,
      ),
    )
  }
}
