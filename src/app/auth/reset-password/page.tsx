"use client"

// =====================================================
// BLOCK: React / Next Imports
// =====================================================

import Link from "next/link"
import { useState } from "react"

// =====================================================
// BLOCK: Icon Imports
// =====================================================

import {
  ArrowRight,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

// =====================================================
// BLOCK: Supabase Imports
// =====================================================

import { createSupabaseBrowserClient } from "@/lib/supabase/client"

// =====================================================
// BLOCK: Reset Password Page
// =====================================================

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)

  // =====================================================
  // BLOCK: Update Password Handler
  // =====================================================

  async function handleUpdatePassword() {
    setLoading(true)
    setMessage("")
    setSuccess(false)

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.")
      setLoading(false)
      return
    }

    try {
      const supabase = createSupabaseBrowserClient()

      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        setMessage(error.message)
      } else {
        setSuccess(true)
        setMessage("Password updated successfully. You can now sign in.")
      }
    } catch {
      setMessage("Password update request failed.")
    }

    setLoading(false)
  }

  // =====================================================
  // BLOCK: Render
  // =====================================================

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
            {success ? <CheckCircle2 size={24} /> : <Lock size={24} />}
          </div>

          <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
            <ShieldCheck size={14} />
            Secure Reset
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Reset your password
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Enter a new password for your Crestpoint account. Use at least 8
            characters for better account protection.
          </p>

          <div className="mt-6 grid gap-4">
            <PasswordField
              label="New Password"
              value={password}
              onChange={setPassword}
              placeholder="Enter new password"
            />

            <PasswordField
              label="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm new password"
            />

            <button
              type="button"
              disabled={loading || !password || !confirmPassword}
              onClick={handleUpdatePassword}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none disabled:hover:translate-y-0"
            >
              {loading ? "Updating password..." : "Update Password"}

              {!loading && <ArrowRight size={17} />}
            </button>
          </div>

          {message && (
            <div
              className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-semibold leading-6 ${
                success
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
            >
              {message}
            </div>
          )}

          {success && (
            <Link
              href="/auth/login"
              className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-black text-blue-700 transition hover:bg-blue-100"
            >
              Go to Login
            </Link>
          )}
        </div>
      </section>
    </main>
  )
}

// =====================================================
// BLOCK: Password Field Component
// =====================================================

type PasswordFieldProps = {
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
}

function PasswordField({
  label,
  value,
  placeholder,
  onChange,
}: PasswordFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-extrabold text-slate-700">
        {label}
      </span>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
        <Lock size={17} className="shrink-0 text-slate-400" />

        <input
          type="password"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>
    </label>
  )
}