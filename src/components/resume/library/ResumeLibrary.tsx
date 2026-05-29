"use client"

import { useEffect, useState } from "react"
import { CreateResumeButton } from "@/components/resume/library/CreateResumeButton"
import { ResumeCard } from "@/components/resume/library/ResumeCard"

type ResumeLibraryItem = {
  id: string
  title: string
  status: string
  selected_template: string
  updated_at: string
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value))
  } catch {
    return "recently"
  }
}

export function ResumeLibrary() {
  const [resumes, setResumes] = useState<ResumeLibraryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  async function loadResumes() {
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/resume/load")
      const result = await response.json()

      if (result.status !== "success") {
        setMessage(result.message || "Unable to load resumes.")
        setResumes([])
        return
      }

      setResumes(result.resumes || [])
    } catch {
      setMessage("Resume library request failed.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResumes()
  }, [])

  function openResume(id: string) {
    window.location.href = `/dashboard/resume?resumeId=${id}`
  }

  function createResume() {
    setMessage(
      "Create resume action will be connected after the resume create API is added."
    )
  }

  function duplicateResume(id: string) {
    setMessage(
      `Duplicate resume ${id} will be connected after the duplicate API is added.`
    )
  }

  function deleteResume(id: string) {
    setMessage(
      `Delete resume ${id} will be connected after the delete API is added.`
    )
  }

  return (
    <div style={{ display: "grid", gap: "18px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "16px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: 900,
              color: "#0f172a",
            }}
          >
            Resume Library
          </h1>

          <p
            style={{
              marginTop: "6px",
              color: "#64748b",
              lineHeight: 1.5,
            }}
          >
            Manage saved resumes, versions, and future job-specific resume
            copies.
          </p>
        </div>

        <CreateResumeButton onCreate={createResume} />
      </div>

      {message && (
        <div
          style={{
            border: "1px solid #dbeafe",
            borderRadius: "14px",
            padding: "12px 14px",
            background: "#eff6ff",
            color: "#1e40af",
            fontWeight: 700,
          }}
        >
          {message}
        </div>
      )}

      {loading ? (
        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "18px",
            padding: "18px",
            background: "#ffffff",
            color: "#64748b",
          }}
        >
          Loading resumes...
        </div>
      ) : resumes.length === 0 ? (
        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "18px",
            padding: "24px",
            background: "#ffffff",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "22px", fontWeight: 900 }}>
            No saved resumes yet
          </h2>

          <p style={{ marginTop: "8px", color: "#64748b" }}>
            Save a resume from the builder to see it here.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {resumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              id={resume.id}
              title={resume.title}
              status={resume.status}
              selectedTemplate={resume.selected_template}
              updatedAt={formatDate(resume.updated_at)}
              onOpen={openResume}
              onDuplicate={duplicateResume}
              onDelete={deleteResume}
            />
          ))}
        </div>
      )}
    </div>
  )
}
