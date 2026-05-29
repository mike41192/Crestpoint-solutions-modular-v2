"use client"

import { useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function handleAuth() {
    setLoading(true)
    setMessage("")

    try {
      const supabase = createSupabaseBrowserClient()

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        })

        if (error) {
          setMessage(error.message)
        } else {
          setMessage(
            "Account created. If email confirmation is enabled, confirm your email before signing in."
          )
        }
      }

      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          setMessage(error.message)
        } else {
          window.location.href = "/dashboard/resume"
        }
      }
    } catch {
      setMessage("Authentication request failed.")
    }

    setLoading(false)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "18px",
          padding: "32px",
          boxShadow: "0 10px 30px rgba(15,23,42,.08)",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 900,
            marginBottom: "8px",
          }}
        >
          Crestpoint Login
        </h1>

        <p
          style={{
            color: "#64748b",
            marginBottom: "24px",
            lineHeight: 1.5,
          }}
        >
          Sign in to save resumes permanently to Supabase.
        </p>

        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "18px",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode("signin")
              setMessage("")
            }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border:
                mode === "signin"
                  ? "2px solid #2563eb"
                  : "1px solid #cbd5e1",
              background: mode === "signin" ? "#eff6ff" : "#ffffff",
              color: "#1d4ed8",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("signup")
              setMessage("")
            }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border:
                mode === "signup"
                  ? "2px solid #2563eb"
                  : "1px solid #cbd5e1",
              background: mode === "signup" ? "#eff6ff" : "#ffffff",
              color: "#1d4ed8",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Create Account
          </button>
        </div>

        {mode === "signup" && (
          <>
            <label style={labelStyle}>Full Name</label>

            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Michael Rodriguez"
              style={inputStyle}
            />
          </>
        )}

        <label style={labelStyle}>Email Address</label>

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@example.com"
          style={inputStyle}
        />

        <label style={labelStyle}>Password</label>

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter password"
          style={inputStyle}
        />

        <button
          type="button"
          disabled={loading || !email || !password}
          onClick={handleAuth}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: 0,
            background: loading || !email || !password ? "#94a3b8" : "#2563eb",
            color: "#ffffff",
            fontWeight: 800,
            cursor: loading || !email || !password ? "not-allowed" : "pointer",
            marginTop: "8px",
          }}
        >
          {loading
            ? "Working..."
            : mode === "signin"
              ? "Sign In"
              : "Create Account"}
        </button>

        {message && (
          <p
            style={{
              marginTop: "16px",
              color: "#334155",
              lineHeight: 1.5,
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: 700,
  color: "#334155",
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  marginBottom: "16px",
}
