export type BrandSettings = {
  brandName: string
  shortName: string
  tagline: string
  logoUrl: string
  faviconUrl: string
  primaryColor: string
  updatedAt: string | null
}

export const defaultBrandSettings: BrandSettings = {
  brandName: "Crestpoint Solutions",
  shortName: "Crestpoint",
  tagline: "Career OS",
  logoUrl: "",
  faviconUrl: "",
  primaryColor: "#2563eb",
  updatedAt: null,
}

export const BRAND_SETTING_ID = "global"
export const BRAND_ASSETS_BUCKET = "brand-assets"

const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/
const IMAGE_ASSET_PATTERN = /\.(png|jpe?g|webp|gif|svg|ico)(\?.*)?$/i
const ICON_ASSET_PATTERN = /\.(ico|png|svg|webp|gif)(\?.*)?$/i

export function cleanBrandText(value: unknown, fallback: string, maxLength = 80) {
  if (typeof value !== "string") {
    return fallback
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return fallback
  }

  return trimmed.slice(0, maxLength)
}

export function cleanBrandUrl(value: unknown) {
  if (typeof value !== "string") {
    return ""
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return ""
  }

  if (trimmed.startsWith("/")) {
    return trimmed.slice(0, 500)
  }

  try {
    const url = new URL(trimmed)

    if (!["https:", "http:"].includes(url.protocol)) {
      return ""
    }

    return url.toString().slice(0, 500)
  } catch {
    return ""
  }
}

export function cleanBrandColor(value: unknown) {
  if (typeof value !== "string") {
    return defaultBrandSettings.primaryColor
  }

  const trimmed = value.trim()

  return HEX_COLOR_PATTERN.test(trimmed)
    ? trimmed
    : defaultBrandSettings.primaryColor
}

export function normalizeBrandSettings(value: unknown): BrandSettings {
  if (!value || typeof value !== "object") {
    return defaultBrandSettings
  }

  const record = value as Record<string, unknown>

  return {
    brandName: cleanBrandText(
      record.brandName ?? record.brand_name,
      defaultBrandSettings.brandName,
    ),
    shortName: cleanBrandText(
      record.shortName ?? record.short_name,
      defaultBrandSettings.shortName,
      40,
    ),
    tagline: cleanBrandText(
      record.tagline,
      defaultBrandSettings.tagline,
      80,
    ),
    logoUrl: cleanBrandUrl(record.logoUrl ?? record.logo_url),
    faviconUrl: cleanBrandUrl(record.faviconUrl ?? record.favicon_url),
    primaryColor: cleanBrandColor(record.primaryColor ?? record.primary_color),
    updatedAt:
      typeof (record.updatedAt ?? record.updated_at) === "string"
        ? String(record.updatedAt ?? record.updated_at)
        : null,
  }
}

export function toBrandSettingsRow(settings: BrandSettings, updatedBy: string | null) {
  return {
    id: BRAND_SETTING_ID,
    brand_name: settings.brandName,
    short_name: settings.shortName,
    tagline: settings.tagline,
    logo_url: settings.logoUrl || null,
    favicon_url: settings.faviconUrl || null,
    primary_color: settings.primaryColor,
    updated_by: updatedBy,
    updated_at: new Date().toISOString(),
  }
}

export function isImageAssetUrl(value: string) {
  return IMAGE_ASSET_PATTERN.test(value)
}

export function isBrowserIconUrl(value: string) {
  return ICON_ASSET_PATTERN.test(value)
}

export function assetFileName(value: string) {
  if (!value) {
    return ""
  }

  try {
    const url = value.startsWith("/") ? new URL(value, "https://local.app") : new URL(value)
    const segment = url.pathname.split("/").filter(Boolean).pop()

    return segment ? decodeURIComponent(segment) : value
  } catch {
    return value.split("/").filter(Boolean).pop() || value
  }
}
