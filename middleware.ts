// =====================================================
// BLOCK: Next Middleware Imports
// =====================================================

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// =====================================================
// BLOCK: Public Route Rules
// =====================================================

const PUBLIC_ROUTES = new Set(["/", "/login", "/pricing"])

const PUBLIC_ROUTE_PREFIXES = ["/auth", "/api/auth"]

// =====================================================
// BLOCK: Protected Route Rules
// =====================================================

const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/admin",
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
    return cookie.name.startsWith("sb-") && Boolean(cookie.value)
  })
}

function buildLoginRedirect(request: NextRequest): NextResponse {
  const loginUrl = request.nextUrl.clone()

  loginUrl.pathname = "/auth/login"
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
    "/administration/:path*",
    "/settings/:path*",
  ],
}
