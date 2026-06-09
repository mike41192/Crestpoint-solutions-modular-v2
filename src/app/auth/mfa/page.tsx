"use client"

// =====================================================
// BLOCK: React / Next Imports
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import Link from "next/link"
import { useEffect, useState } from "react"

// =====================================================
// BLOCK: Icon Imports
// =====================================================

import { ArrowRight, KeyRound, ShieldCheck, Sparkles } from "lucide-react"

// =====================================================
// BLOCK: MFA Page
// =====================================================

export default function MfaPage() {
  const [code, setCode] = useState("")
  const [message, setMessage] = useState("")

  function getRedirectTo() {
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

  useEffect(() => {
    const messageParam = new URLSearchParams(window.location.search).get(
      "message",
    )

    if (messageParam) {
      setMessage(messageParam)
    }
  }, [])

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-5 lg:px-8">
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
          href="/auth/login"
          className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
        >
          Back to Login
        </Link>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-90px)] max-w-[1200px] items-center justify-center px-5 pb-10 lg:px-8">
        <div className="w-full max-w-[520px] rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <ShieldCheck size={24} />
          </div>

          <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
            <KeyRound size={14} />
            Two-Factor Authentication
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Enter your authenticator code
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Open your authenticator app and enter the current 6-digit code to
            finish signing in.
          </p>

          <form
            action="/api/auth/mfa/verify"
            method="post"
            className="mt-6 grid gap-4"
          >
            <input type="hidden" name="redirectTo" value={getRedirectTo()} />

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold text-slate-700">
                Authenticator Code
              </span>

              <input
                name="totpCode"
                value={code}
                onChange={(event) => {
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                }}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="123456"
                maxLength={6}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-2xl font-black tracking-[0.3em] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <button
              type="submit"
              disabled={code.length !== 6}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none disabled:hover:translate-y-0"
            >
              Verify Code
              <ArrowRight size={17} />
            </button>
          </form>

          {message && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-700">
              {message}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
