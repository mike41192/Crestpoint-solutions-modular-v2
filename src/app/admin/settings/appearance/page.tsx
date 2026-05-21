import { themeConfig } from "@/lib/config/theme.config"

export default function AdminAppearanceSettingsPage() {
  return (
    <main style={{ padding: "32px", background: themeConfig.backgroundColor }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
          Appearance Settings
        </h1>

        <p style={{ marginTop: "8px", color: "#64748b" }}>
          Review global appearance settings before live admin-controlled theming is enabled.
        </p>
      </div>

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: themeConfig.cardRadius,
            padding: "20px",
            background: "#ffffff",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 700 }}>Theme Mode</h2>
          <p style={{ marginTop: "8px", textTransform: "capitalize" }}>
            {themeConfig.mode}
          </p>
        </div>

        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: themeConfig.cardRadius,
            padding: "20px",
            background: "#ffffff",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
            Background Color
          </h2>
          <p style={{ marginTop: "8px" }}>{themeConfig.backgroundColor}</p>
        </div>

        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: themeConfig.cardRadius,
            padding: "20px",
            background: "#ffffff",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 700 }}>Accent Color</h2>

          <div
            style={{
              marginTop: "12px",
              height: "36px",
              width: "100%",
              borderRadius: "10px",
              background: themeConfig.accentColor,
            }}
          />
        </div>

        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: themeConfig.cardRadius,
            padding: "20px",
            background: "#ffffff",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 700 }}>Layout Style</h2>
          <p style={{ marginTop: "8px", textTransform: "capitalize" }}>
            {themeConfig.layoutStyle}
          </p>
        </div>
      </section>
    </main>
  )
}