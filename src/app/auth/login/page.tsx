"use client"

// =====================================================
// BLOCK: React / Next Imports
// =====================================================

import Link from "next/link"
import { useEffect, useState } from "react"

// =====================================================
// BLOCK: Icon Imports
// =====================================================

import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react"

// =====================================================
// BLOCK: Supabase Imports
// =====================================================

import { createSupabaseBrowserClient } from "@/lib/supabase/client"

// =====================================================
// BLOCK: Production URL Helper
// =====================================================

function getAppUrl() {
  // Vercel production URL from environment variable
  if (
    process.env.NEXT_PUBLIC_SITE_URL &&
    process.env.NEXT_PUBLIC_SITE_URL.length > 0
  ) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  // Browser fallback
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  return "https://crestpoint-solutions.vercel.app"
}

// =====================================================
// BLOCK: Redirect Helper
// =====================================================

function getDashboardRedirectPath() {
  if (typeof window === "undefined") {
    return "/dashboard"
  }

  const redirectTo = new URLSearchParams(window.location.search).get(
    "redirectTo",
  )

  if (!redirectTo || !redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return "/dashboard"
  }

  return redirectTo
}
// =====================================================
// BLOCK: Page Component
// =====================================================

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [message, setMessage] = useState("")

  // =====================================================
  // BLOCK: Email / Password Auth Handler
  // =====================================================

  async function handleSignup() {
    setMessage("")
    const normalizedEmail = email.trim()

    if (!normalizedEmail || !password) {
      setMessage("Enter your email address and password to continue.")
      return
    }

    setLoading(true)

    try {
      const supabase = createSupabaseBrowserClient()

      const { error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      })

      if (error) {
        setMessage(error.message)
      } else {
        setMessage(
          "Account created. If email confirmation is enabled, confirm your email before signing in.",
        )
      }
    } catch {
      setMessage("Authentication request failed.")
    }

    setLoading(false)
  }

  // =====================================================
  // BLOCK: Forgot Password Handler
  // =====================================================

  async function handleForgotPassword() {
    if (!email.trim()) {
      setMessage("Enter your email address first, then click Forgot Password.")
      return
    }

    setResetLoading(true)
    setMessage("")

    try {
      const supabase = createSupabaseBrowserClient()

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${getAppUrl()}/auth/callback?next=/auth/reset-password`,
        },
      )

      if (error) {
        setMessage(error.message)
      } else {
        setMessage("Password reset email sent. Check your inbox.")
      }
    } catch {
      setMessage("Password reset request failed.")
    }

    setResetLoading(false)
  }

  // =====================================================
  // BLOCK: URL Message Handler
  // =====================================================

  useEffect(() => {
    const messageParam = new URLSearchParams(window.location.search).get(
      "message",
    )

    if (messageParam) {
      setMessage(messageParam)
    }
  }, [])

  // =====================================================
  // BLOCK: Render
  // =====================================================

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Sparkles size={20} />
          </div>

          <div>
            <p className="text-sm font-black text-slate-950">
              Crestpoint Solutions
            </p>
            <p className="text-xs font-semibold text-slate-500">
              Career Operating System
            </p>
          </div>
        </Link>

        <Link
          href="/"
          className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
        >
          Back Home
        </Link>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-90px)] max-w-[1400px] gap-8 px-5 pb-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
        <div className="hidden lg:block">
          <div className="rounded-[36px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70">
            <div className="rounded-[30px] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white">
              <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <ShieldCheck size={14} />
                Secure Career Workspace
              </div>

              <h1 className="max-w-xl text-4xl font-black tracking-tight">
                Sign in to continue building your career system.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
                Save resumes, track progress, use AI tools, and manage your job
                search from your Crestpoint command center.
              </p>

              <div className="mt-8 grid gap-3">
                {[
                  "Save resumes permanently to your account",
                  "Access your career dashboard and resume library",
                  "Continue ATS scoring, interview prep, and job tracking",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-slate-100"
                  >
                    <CheckCircle2 size={17} className="text-blue-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <FeatureMiniCard icon={FileText} title="Resumes" />
              <FeatureMiniCard icon={ShieldCheck} title="ATS Tools" />
              <FeatureMiniCard icon={Lock} title="Secure Login" />
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[500px]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              {mode === "signin" ? <Lock size={24} /> : <UserRound size={24} />}
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-950">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {mode === "signin"
                ? "Sign in to access your resumes, saved work, and career dashboard."
                : "Create an account to save your resumes and start building your career workspace."}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("signin")
                  setMessage("")
                }}
                className={`rounded-xl px-4 py-2.5 text-sm font-black transition ${
                  mode === "signin"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-950"
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("signup")
                  setMessage("")
                }}
                className={`rounded-xl px-4 py-2.5 text-sm font-black transition ${
                  mode === "signup"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-950"
                }`}
              >
                Create Account
              </button>
            </div>

            <form
              action="/api/auth/login"
              method="post"
              className="mt-6 grid gap-4"
            >
              <input
                type="hidden"
                name="redirectTo"
                value={getDashboardRedirectPath()}
              />

              {mode === "signup" && (
                <Field
                  label="Full Name"
                  name="name"
                  type="text"
                  value={fullName}
                  onChange={setFullName}
                  placeholder="Michael Rodriguez"
                  icon={UserRound}
                  autoComplete="name"
                />
              )}

              <Field
                label="Email Address"
                name="email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="name@example.com"
                icon={Mail}
                autoComplete="email"
              />

              <Field
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Enter password"
                icon={Lock}
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
              />

              {mode === "signin" && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resetLoading}
                  className="w-fit text-sm font-black text-blue-700 transition hover:text-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {resetLoading ? "Sending reset email..." : "Forgot password?"}
                </button>
              )}

              <button
                type={mode === "signin" ? "submit" : "button"}
                onClick={mode === "signup" ? handleSignup : undefined}
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none disabled:hover:translate-y-0"
              >
                {loading
                  ? "Working..."
                  : mode === "signin"
                    ? "Sign In"
                    : "Create Account"}

                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            {message && (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-700">
                {message}
              </div>
            )}

            <p className="mt-6 text-center text-xs leading-5 text-slate-500">
              By continuing, you can access Crestpoint resume, ATS, interview,
              and job search tools connected to your account.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

// =====================================================
// BLOCK: Reusable Field Component
// =====================================================

type FieldProps = {
  label: string
  name: string
  type: string
  value: string
  placeholder: string
  onChange: (value: string) => void
  icon: React.ComponentType<{ size?: number; className?: string }>
  autoComplete: string
}

function Field({
  label,
  name,
  type,
  value,
  placeholder,
  onChange,
  icon: Icon,
  autoComplete,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-extrabold text-slate-700">
        {label}
      </span>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
        <Icon size={17} className="shrink-0 text-slate-400" />

        <input
          name={name}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full min-w-0 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>
    </label>
  )
}

// =====================================================
// BLOCK: Reusable Feature Card
// =====================================================

function FeatureMiniCard({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ size?: number }>
  title: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-2 w-fit rounded-xl bg-blue-50 p-2 text-blue-700">
        <Icon size={17} />
      </div>
      <p className="text-sm font-black text-slate-950">{title}</p>
    </div>
  )
}
