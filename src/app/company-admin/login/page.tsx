"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

export default function CompanyAdminLoginPage() {
  const [message, setMessage] = useState("")
  const [redirectTo, setRedirectTo] = useState("/company-admin/access")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const messageParam = params.get("message")
    const redirectToParam = params.get("redirectTo")

    if (messageParam) {
      setMessage(messageParam)
    }

    if (
      redirectToParam &&
      redirectToParam.startsWith("/company-admin") &&
      !redirectToParam.startsWith("//")
    ) {
      setRedirectTo(redirectToParam)
    }
  }, [])

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="mx-auto flex max-w-[1300px] items-center justify-between px-5 py-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Sparkles size={20} />
          </div>

          <div>
            <p className="text-sm font-black text-slate-950">
              Crestpoint Solutions
            </p>
            <p className="text-xs font-semibold text-slate-500">
              Business Access Portal
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
          >
            User Login
          </Link>
          <Link
            href="/admin/login"
            className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
          >
            Platform Admin
          </Link>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-90px)] max-w-[1300px] gap-8 px-5 pb-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
        <div className="hidden lg:block">
          <div className="rounded-[36px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70">
            <div className="rounded-[30px] bg-slate-950 p-8 text-white">
              <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <Building2 size={14} />
                Business Admin
              </div>

              <h1 className="max-w-xl text-4xl font-black tracking-tight">
                Manage your company access list.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
                Sign in with your company admin account to add seats, suspend
                access, and keep your organization roster current.
              </p>

              <div className="mt-8 grid gap-3">
                {[
                  "Add and remove member seats within company limits",
                  "Manage only your assigned organization",
                  "Platform admins retain company tier and seat authority",
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
              <ShieldCheck size={24} />
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-950">
              Business admin sign in
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Use your company admin account to open the business access portal.
            </p>

            <form
              action="/api/auth/login"
              method="post"
              className="mt-6 grid gap-4"
            >
              <input type="hidden" name="companyAdminLogin" value="true" />
              <input type="hidden" name="redirectTo" value={redirectTo} />

              <label className="block">
                <span className="mb-2 block text-sm font-extrabold text-slate-700">
                  Business Admin Email
                </span>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                  <Mail size={17} className="shrink-0 text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="admin@company.com"
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
                Open Business Portal
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
