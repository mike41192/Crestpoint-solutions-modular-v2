"use client"

import { useMemo, useState } from "react"
import { ResumeATSPanel } from "@/components/resume/ResumeATSPanel"
import {
  analyzeResumeAgainstJobDescription,
  type ResumeBuilderFormData,
} from "@/modules/resume-builder"

type ResumeJobMatchFormProps = {
  data: ResumeBuilderFormData
}

export function ResumeJobMatchForm({ data }: ResumeJobMatchFormProps) {
  const [jobDescription, setJobDescription] = useState("")

  const atsResult = useMemo(
    () => analyzeResumeAgainstJobDescription(data, jobDescription),
    [data, jobDescription]
  )

  return (
    <div
      style={{
        border: "1px solid #ddd6fe",
        borderRadius: "12px",
        padding: "14px",
        background: "#f5f3ff",
        display: "grid",
        gap: "14px",
      }}
    >
      <div>
        <h3 style={{ fontSize: "18px", fontWeight: 700 }}>
          ATS Job Match
        </h3>

        <p style={{ marginTop: "6px", color: "#475569", lineHeight: 1.5 }}>
          Paste a job description to compare your resume against target role
          keywords and receive an ATS compatibility score.
        </p>
      </div>

      <label
        style={{
          display: "block",
          fontWeight: 700,
          color: "#334155",
        }}
      >
        Job Description
        <textarea
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          placeholder="Paste job description here..."
          style={{
            width: "100%",
            marginTop: "8px",
            minHeight: "180px",
            resize: "vertical",
            padding: "10px 12px",
            border: "1px solid #c4b5fd",
            borderRadius: "10px",
          }}
        />
      </label>

      <ResumeATSPanel result={atsResult} />
    </div>
  )
}