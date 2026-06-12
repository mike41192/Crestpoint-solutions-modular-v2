// =====================================================
// BLOCK: Next Middleware Imports
// =====================================================

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// =====================================================
// BLOCK: Public Route Rules
// =====================================================

const PUBLIC_ROUTES = new Set([
  "/",
  "/login",
  "/pricing",
  "/admin/login",
  "/company-admin/login",
])

const PUBLIC_ROUTE_PREFIXES = ["/auth", "/api/auth"]

// =====================================================
// BLOCK: Protected Route Rules
// =====================================================

const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/admin",
  "/company-admin",
  "/administration",
  "/settings",
]

// =====================================================
// BLOCK: Helper Functions
// =====================================================

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.has(pathname)) {
    return true
  }

  return PUBLIC_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function hasSupabaseAuthCookie(request: NextRequest): boolean {
  return request.cookies.getAll().some((cookie) => {
    const normalizedName = cookie.name.toLowerCase()

    return (
      Boolean(cookie.value) &&
      (normalizedName.startsWith("sb-") ||
        normalizedName.includes("supabase") ||
        normalizedName.includes("auth-token"))
    )
  })
}

function buildLoginRedirect(request: NextRequest): NextResponse {
  const loginUrl = request.nextUrl.clone()

  if (request.nextUrl.pathname.startsWith("/admin")) {
    loginUrl.pathname = "/admin/login"
  } else if (request.nextUrl.pathname.startsWith("/company-admin")) {
    loginUrl.pathname = "/company-admin/login"
  } else {
    loginUrl.pathname = "/auth/login"
  }

  loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname)

  return NextResponse.redirect(loginUrl)
}

// =====================================================
// BLOCK: Middleware
// =====================================================

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next()
  }

  if (!hasSupabaseAuthCookie(request)) {
    return buildLoginRedirect(request)
  }

  return NextResponse.next()
}

// =====================================================
// BLOCK: Middleware Matcher
// =====================================================

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/company-admin/:path*",
    "/administration/:path*",
    "/settings/:path*",
  ],
}
