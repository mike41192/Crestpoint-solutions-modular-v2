"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react"

import { BrandIdentity } from "@/components/branding/BrandIdentity"

export default function AdminLoginPage() {
  const [message, setMessage] = useState("")

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
      <header className="mx-auto flex max-w-[1300px] items-center justify-between px-5 py-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <BrandIdentity subtitle="Admin Control Center" />
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/company-admin/login"
            className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
          >
            Business Admin
          </Link>
          <Link
            href="/auth/login"
            className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
          >
            User Login
          </Link>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-90px)] max-w-[1300px] gap-8 px-5 pb-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
        <div className="hidden lg:block">
          <div className="rounded-[36px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70">
            <div className="rounded-[30px] bg-slate-950 p-8 text-white">
              <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <ShieldCheck size={14} />
                Owner Access
              </div>

              <h1 className="max-w-xl text-4xl font-black tracking-tight">
                Sign in to manage Crestpoint operations.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
                Secure owner access for system settings, diagnostics, and
                operational controls.
              </p>

              <div className="mt-8 grid gap-3">
                {[
                  "Manage system settings and diagnostics",
                  "Review billing, Supabase, GitHub, and Vercel readiness",
                  "Access owner-only AI and module controls",
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
          </div>
        </div>

        <div className="mx-auto w-full max-w-[500px]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <LockKeyhole size={24} />
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-950">
              Admin sign in
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Use your owner account to access the admin command center.
            </p>

            <form
              action="/api/auth/login"
              method="post"
              className="mt-6 grid gap-4"
            >
              <input type="hidden" name="redirectTo" value="/admin/settings" />
              <input type="hidden" name="adminLogin" value="true" />

              <label className="block">
                <span className="mb-2 block text-sm font-extrabold text-slate-700">
                  Admin Email
                </span>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                  <Mail size={17} className="shrink-0 text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="owner@example.com"
                    className="w-full min-w-0 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-extrabold text-slate-700">
                  Password
                </span>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                  <LockKeyhole size={17} className="shrink-0 text-slate-400" />
                  <input
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Enter password"
                    className="w-full min-w-0 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Open Admin
                <ArrowRight size={17} />
              </button>
            </form>

            {message && (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-700">
                {message}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
