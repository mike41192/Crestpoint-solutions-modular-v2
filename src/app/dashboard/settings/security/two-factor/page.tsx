"use client"

// =====================================================
// BLOCK: React Imports
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import { useEffect, useState } from "react"

// =====================================================
// BLOCK: Icon Imports
// =====================================================

import { KeyRound, QrCode, ShieldCheck, Smartphone, Trash2 } from "lucide-react"

// =====================================================
// BLOCK: Layout Imports
// =====================================================

import { ModulePageLayout } from "@/components/layout/ModulePageLayout"
import { SettingsPageShell } from "@/components/settings/SettingsPageShell"

// =====================================================
// BLOCK: Supabase Imports
// =====================================================

import { createSupabaseBrowserClient } from "@/lib/supabase/client"

// =====================================================
// BLOCK: Types
// =====================================================

type TotpEnrollment = {
  factorId: string
  qrCode: string
  secret: string
}

type VerifiedFactor = {
  id: string
  friendly_name?: string
  status?: string
}

// =====================================================
// BLOCK: Two-Factor Authentication Page
// =====================================================

export default function TwoFactorSettingsPage() {
  const [verifiedFactors, setVerifiedFactors] = useState<VerifiedFactor[]>([])
  const [enrollment, setEnrollment] = useState<TotpEnrollment | null>(null)
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  async function loadFactors() {
    setLoading(true)
    setMessage("")

    const supabase = createSupabaseBrowserClient()
    const { data, error } = await supabase.auth.mfa.listFactors()

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setVerifiedFactors(
      data.totp
        .filter((factor) => factor.status === "verified")
        .map((factor) => ({
          id: factor.id,
          friendly_name: factor.friendly_name,
          status: factor.status,
        })),
    )
    setLoading(false)
  }

  useEffect(() => {
    loadFactors()
  }, [])

  async function startEnrollment() {
    setSaving(true)
    setMessage("")
    setEnrollment(null)
    setCode("")

    const supabase = createSupabaseBrowserClient()

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Crestpoint Authenticator",
    })

    if (error || !data) {
      setMessage(error?.message || "Unable to start authenticator enrollment.")
      setSaving(false)
      return
    }

    setEnrollment({
      factorId: data.id,
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
    })
    setSaving(false)
  }

  async function verifyEnrollment() {
    if (!enrollment || !code.trim()) {
      setMessage("Enter the 6-digit code from your authenticator app.")
      return
    }

    setSaving(true)
    setMessage("")

    const supabase = createSupabaseBrowserClient()

    const { data: challengeData, error: challengeError } =
      await supabase.auth.mfa.challenge({
        factorId: enrollment.factorId,
      })

    if (challengeError || !challengeData) {
      setMessage(challengeError?.message || "Unable to create MFA challenge.")
      setSaving(false)
      return
    }

    const { error } = await supabase.auth.mfa.verify({
      factorId: enrollment.factorId,
      challengeId: challengeData.id,
      code: code.trim(),
    })

    if (error) {
      setMessage(error.message)
      setSaving(false)
      return
    }

    setMessage("Two-factor authentication is now enabled.")
    setEnrollment(null)
    setCode("")
    setSaving(false)
    await loadFactors()
  }

  async function removeFactor(factorId: string) {
    const confirmed = window.confirm(
      "Disable this authenticator app? Your account will no longer require this factor.",
    )

    if (!confirmed) {
      return
    }

    setSaving(true)
    setMessage("")

    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.mfa.unenroll({
      factorId,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("Authenticator app removed.")
      await loadFactors()
    }

    setSaving(false)
  }

  return (
    <ModulePageLayout
      title="Two-Factor Authentication"
      description="Enable or manage TOTP authenticator app protection."
    >
      <SettingsPageShell
        eyebrow="Security Settings"
        title="Two-Factor Authentication"
        description="Use a time-based one-time password from an authenticator app to add a second sign-in step."
      >
        <div className="grid gap-5">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    Authenticator App
                  </h3>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Scan a QR code with Google Authenticator, 1Password, Authy,
                    iCloud Passwords, or another TOTP-compatible app.
                  </p>
                </div>
              </div>

              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${
                  verifiedFactors.length > 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {loading
                  ? "Checking"
                  : verifiedFactors.length > 0
                    ? "Enabled"
                    : "Disabled"}
              </span>
            </div>
          </section>

          {verifiedFactors.length > 0 && (
            <section className="grid gap-3">
              {verifiedFactors.map((factor) => (
                <article
                  key={factor.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                        <Smartphone size={20} />
                      </div>

                      <div>
                        <h3 className="font-black text-slate-950">
                          {factor.friendly_name || "Authenticator App"}
                        </h3>

                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          Verified TOTP factor
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFactor(factor.id)}
                      disabled={saving}
                      className="inline-flex w-fit items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-black text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 size={15} />
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}

          {!enrollment && (
            <button
              type="button"
              onClick={startEnrollment}
              disabled={saving}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <KeyRound size={16} />
              {verifiedFactors.length > 0
                ? "Add Another Authenticator"
                : "Enable Authenticator App"}
            </button>
          )}

          {enrollment && (
            <section className="rounded-3xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white p-3 text-blue-700 shadow-sm">
                  <QrCode size={22} />
                </div>

                <div>
                  <h3 className="text-lg font-black text-blue-950">
                    Scan QR Code
                  </h3>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-800">
                    Scan this code in your authenticator app, then enter the
                    current 6-digit code to finish setup.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
                <div className="rounded-3xl border border-blue-100 bg-white p-4">
                  <img
                    src={enrollment.qrCode}
                    alt="Two-factor authentication QR code"
                    className="mx-auto aspect-square w-full max-w-[220px]"
                  />
                </div>

                <div className="grid gap-4">
                  <div className="rounded-2xl border border-blue-100 bg-white p-4">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">
                      Manual Secret
                    </p>

                    <p className="mt-2 break-all font-mono text-sm font-bold text-slate-700">
                      {enrollment.secret}
                    </p>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-blue-950">
                      Verification Code
                    </span>

                    <input
                      value={code}
                      onChange={(event) => setCode(event.target.value)}
                      inputMode="numeric"
                      placeholder="123456"
                      maxLength={6}
                      className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-center text-2xl font-black tracking-[0.3em] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={verifyEnrollment}
                    disabled={saving}
                    className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    <ShieldCheck size={16} />
                    {saving ? "Verifying..." : "Verify and Enable"}
                  </button>
                </div>
              </div>
            </section>
          )}

          {message && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              {message}
            </div>
          )}
        </div>
      </SettingsPageShell>
    </ModulePageLayout>
  )
}
