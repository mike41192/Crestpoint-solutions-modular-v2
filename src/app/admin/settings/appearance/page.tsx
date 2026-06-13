"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import {
  BadgeCheck,
  Image as ImageIcon,
  Loader2,
  Paintbrush,
  RefreshCw,
  RotateCcw,
  Save,
} from "lucide-react"

import {
  defaultBrandSettings,
  type BrandSettings,
} from "@/lib/branding/brand-config"

type BrandApiResponse = {
  status: string
  message?: string
  settings?: BrandSettings
}

const colorPresets = [
  "#2563eb",
  "#0f172a",
  "#047857",
  "#be123c",
  "#7c3aed",
  "#0891b2",
]

export default function AdminAppearanceSettingsPage() {
  const [settings, setSettings] = useState<BrandSettings>(defaultBrandSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function loadBranding() {
    setLoading(true)
    setMessage("")
    setError("")

    try {
      const response = await fetch("/api/admin/branding", {
        cache: "no-store",
      })
      const payload = (await response.json()) as BrandApiResponse

      if (!response.ok || payload.status !== "success") {
        throw new Error(payload.message || "Brand settings could not be loaded.")
      }

      setSettings(payload.settings || defaultBrandSettings)
    } catch (loadError) {
      setSettings(defaultBrandSettings)
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Brand settings could not be loaded.",
      )
    } finally {
      setLoading(false)
    }
  }

  async function saveBranding(nextSettings = settings) {
    setSaving(true)
    setMessage("")
    setError("")

    try {
      const response = await fetch("/api/admin/branding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings: nextSettings }),
      })
      const payload = (await response.json()) as BrandApiResponse

      if (!response.ok || payload.status !== "success") {
        throw new Error(payload.message || "Brand settings could not be saved.")
      }

      setSettings(payload.settings || nextSettings)
      setMessage("Brand settings saved. Open pages will update on refresh.")
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Brand settings could not be saved.",
      )
    } finally {
      setSaving(false)
    }
  }

  function updateField<K extends keyof BrandSettings>(
    key: K,
    value: BrandSettings[K],
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function resetDefaults() {
    setSettings(defaultBrandSettings)
    setMessage("Defaults staged. Save changes to publish them.")
    setError("")
  }

  useEffect(() => {
    loadBranding()
  }, [])

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1500px] gap-5">
        <section className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm sm:p-7">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <Paintbrush size={14} />
                Brand Studio
              </div>
              <h1 className="text-3xl font-black tracking-tight">
                Appearance and branding
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                Update the platform logo, favicon, brand names, and primary
                accent color from one admin-controlled workspace.
              </p>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-100">
                Current Brand
              </p>
              <div className="mt-4 flex items-center gap-3">
                <BrandPreviewMark settings={settings} />
                <div className="min-w-0">
                  <p className="truncate text-lg font-black">
                    {settings.brandName}
                  </p>
                  <p className="truncate text-sm font-semibold text-slate-300">
                    {settings.shortName} / {settings.tagline}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {message ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold leading-6 text-amber-900">
            {error}
          </div>
        ) : null}

        <section className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)]">
          <div className="grid gap-5">
            <Panel title="Identity">
              <div className="grid gap-4">
                <TextField
                  label="Company name"
                  value={settings.brandName}
                  onChange={(value) => updateField("brandName", value)}
                  placeholder="Crestpoint Solutions"
                />
                <TextField
                  label="Short name"
                  value={settings.shortName}
                  onChange={(value) => updateField("shortName", value)}
                  placeholder="Crestpoint"
                />
                <TextField
                  label="Sidebar tagline"
                  value={settings.tagline}
                  onChange={(value) => updateField("tagline", value)}
                  placeholder="Career OS"
                />
              </div>
            </Panel>

            <Panel title="Assets">
              <div className="grid gap-4">
                <TextField
                  label="Logo URL"
                  value={settings.logoUrl}
                  onChange={(value) => updateField("logoUrl", value)}
                  placeholder="https://example.com/logo.png"
                />
                <TextField
                  label="Favicon URL"
                  value={settings.faviconUrl}
                  onChange={(value) => updateField("faviconUrl", value)}
                  placeholder="https://example.com/favicon.ico"
                />
                <p className="text-sm font-semibold leading-6 text-slate-500">
                  Use a square PNG/SVG for the logo and a 32x32 or 48x48 ICO/PNG
                  for the favicon. Relative paths like /brand/favicon.png are
                  also supported after the file exists in the app.
                </p>
              </div>
            </Panel>

            <Panel title="Accent Color">
              <div className="grid gap-4">
                <div className="flex flex-wrap gap-2">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={color}
                      onClick={() => updateField("primaryColor", color)}
                      className={`h-10 w-10 rounded-full border-4 transition ${
                        settings.primaryColor === color
                          ? "border-slate-950"
                          : "border-white"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <label className="grid gap-2">
                  <span className="text-sm font-black text-slate-700">
                    Custom hex
                  </span>
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(event) =>
                      updateField("primaryColor", event.target.value)
                    }
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    placeholder="#2563eb"
                  />
                </label>
              </div>
            </Panel>
          </div>

          <div className="grid gap-5">
            <Panel title="Live Preview">
              <div className="grid gap-4">
                <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-5 rounded-3xl bg-slate-950 p-5 text-white">
                    <div className="flex items-center gap-3">
                      <BrandPreviewMark settings={settings} />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-black uppercase tracking-[0.18em] text-blue-200">
                          {settings.shortName}
                        </p>
                        <h2 className="truncate text-xl font-black">
                          {settings.tagline}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    {["Dashboard", "Resume Builder", "Admin Analytics"].map(
                      (item, index) => (
                        <div
                          key={item}
                          className={`rounded-2xl px-4 py-3 text-sm font-extrabold ${
                            index === 0
                              ? "border bg-blue-50"
                              : "bg-slate-50 text-slate-600"
                          }`}
                          style={
                            index === 0
                              ? {
                                  borderColor: settings.primaryColor,
                                  color: settings.primaryColor,
                                }
                              : undefined
                          }
                        >
                          {item}
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4 flex items-center gap-2 text-sm font-black text-slate-700">
                    <ImageIcon size={17} />
                    Browser Tab Preview
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                      {settings.faviconUrl ? (
                        <img
                          src={settings.faviconUrl}
                          alt=""
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-xs font-black text-slate-500">
                          {settings.shortName.slice(0, 1)}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-sm font-bold text-slate-800">
                      {settings.brandName}
                    </p>
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="Publish">
              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={() => saveBranding()}
                  disabled={saving || loading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
                  Save Branding
                </button>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={loadBranding}
                    disabled={loading || saving}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                  >
                    {loading ? <Loader2 size={17} className="animate-spin" /> : <RefreshCw size={17} />}
                    Reload
                  </button>
                  <button
                    type="button"
                    onClick={resetDefaults}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                  >
                    <RotateCcw size={17} />
                    Reset
                  </button>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-600">
                  <BadgeCheck className="mr-2 inline text-emerald-600" size={17} />
                  Saved branding is loaded by the favicon runtime, login
                  headers, and dashboard sidebar.
                </div>
              </div>
            </Panel>
          </div>
        </section>
      </div>
    </main>
  )
}

function Panel({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-xl font-black text-slate-950">{title}</h2>
      {children}
    </section>
  )
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />
    </label>
  )
}

function BrandPreviewMark({ settings }: { settings: BrandSettings }) {
  if (settings.logoUrl) {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white">
        <img
          src={settings.logoUrl}
          alt=""
          className="h-full w-full object-contain p-1"
        />
      </div>
    )
  }

  return (
    <div
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-black text-white"
      style={{ backgroundColor: settings.primaryColor }}
    >
      {settings.shortName.slice(0, 1)}
    </div>
  )
}
