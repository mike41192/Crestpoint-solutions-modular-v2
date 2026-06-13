"use client"

import { useEffect } from "react"

import {
  isBrowserIconUrl,
  type BrandSettings,
} from "@/lib/branding/brand-config"

type BrandResponse = {
  status: string
  settings?: BrandSettings
}

function setFavicon(href: string) {
  const existing =
    document.querySelector<HTMLLinkElement>('link[rel="icon"]') ||
    document.querySelector<HTMLLinkElement>('link[rel="shortcut icon"]')
  const link = existing || document.createElement("link")

  link.rel = "icon"
  link.href = href

  if (!existing) {
    document.head.appendChild(link)
  }
}

export function BrandRuntime() {
  useEffect(() => {
    let mounted = true

    async function loadBranding() {
      try {
        const response = await fetch("/api/branding", { cache: "no-store" })
        const payload = (await response.json()) as BrandResponse
        const settings = payload.settings

        if (!mounted || !response.ok || !settings) {
          return
        }

        document.title = settings.brandName

        if (settings.faviconUrl && isBrowserIconUrl(settings.faviconUrl)) {
          setFavicon(settings.faviconUrl)
        }

        document.documentElement.style.setProperty(
          "--brand-primary",
          settings.primaryColor,
        )
      } catch {
        // Branding is decorative; leave default metadata if the read fails.
      }
    }

    loadBranding()

    return () => {
      mounted = false
    }
  }, [])

  return null
}
