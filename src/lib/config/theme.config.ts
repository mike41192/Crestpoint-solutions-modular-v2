export type ThemeMode = "light" | "dark" | "system"

export type ThemeConfig = {
  mode: ThemeMode
  backgroundColor: string
  accentColor: string
  cardRadius: string
  layoutStyle: "clean" | "compact" | "spacious"
}

export const themeConfig: ThemeConfig = {
  mode: "light",
  backgroundColor: "#f8fafc",
  accentColor: "#2563eb",
  cardRadius: "16px",
  layoutStyle: "clean",
}