"use client"

import { Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

import {
  defaultBrandSettings,
  type BrandSettings,
} from "@/lib/branding/brand-config"

type BrandResponse = {
  status: string
  settings?: BrandSettings
}

type BrandIdentityProps = {
  variant?: "sidebar" | "compact"
  subtitle?: string
}

export function BrandIdentity({
  variant = "compact",
  subtitle,
}: BrandIdentityProps) {
  const [settings, setSettings] = useState(defaultBrandSettings)

  useEffect(() => {
    let mounted = true

    async function loadBranding() {
      try {
        const response = await fetch("/api/branding", { cache: "no-store" })
        const payload = (await response.json()) as BrandResponse

        if (mounted && response.ok && payload.settings) {
          setSettings(payload.settings)
        }
      } catch {
        setSettings(defaultBrandSettings)
      }
    }

    loadBranding()

    return () => {
      mounted = false
    }
  }, [])

  if (variant === "sidebar") {
    return (
      <div className="flex items-center gap-3">
        <BrandMark settings={settings} size="lg" />

        <div className="min-w-0">
          <p className="truncate text-xs font-black uppercase tracking-[0.18em] text-blue-200">
            {settings.shortName}
          </p>
          <h2 className="truncate text-xl font-black">{settings.tagline}</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <BrandMark settings={settings} size="md" />

      <div className="min-w-0">
        <p className="truncate text-sm font-black text-slate-950">
          {settings.brandName}
        </p>
        <p className="truncate text-xs font-semibold text-slate-500">
          {subtitle || settings.tagline}
        </p>
      </div>
    </div>
  )
}

function BrandMark({
  settings,
  size,
}: {
  settings: BrandSettings
  size: "md" | "lg"
}) {
  const classes =
    size === "lg"
      ? "h-12 w-12 rounded-2xl"
      : "h-10 w-10 rounded-2xl"

  if (settings.logoUrl) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center overflow-hidden bg-white/95 ${classes}`}
      >
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
      className={`flex shrink-0 items-center justify-center text-white ${classes}`}
      style={{ backgroundColor: settings.primaryColor }}
    >
      {size === "lg" ? (
        <span className="text-xl font-black text-white">
          {settings.shortName.slice(0, 1)}
        </span>
      ) : (
        <Sparkles size={20} />
      )}
    </div>
  )
}
