export default function InterviewAcademyPage() {
  return (
    <main style={{ padding: "32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
          Interview Academy
        </h1>

        <p style={{ marginTop: "8px", color: "#64748b" }}>
          Learn how to prepare for interviews, improve confidence, answer difficult questions, and increase your chances of getting hired.
        </p>
      </div>

      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "20px",
            background: "#ffffff",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
            Interview Basics
          </h2>

          <p style={{ marginTop: "8px", color: "#64748b" }}>
            Learn the foundations of successful interviewing and employer expectations.
          </p>
        </div>

        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "20px",
            background: "#ffffff",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
            STAR Method
          </h2>

          <p style={{ marginTop: "8px", color: "#64748b" }}>
            Practice answering behavioral questions using the STAR framework.
          </p>
        </div>

        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "20px",
            background: "#ffffff",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
            Confidence Training
          </h2>

          <p style={{ marginTop: "8px", color: "#64748b" }}>
            Improve communication, body language, and confidence during interviews.
          </p>
        </div>

        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "20px",
            background: "#ffffff",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
            AI Interview Practice
          </h2>

          <p style={{ marginTop: "8px", color: "#64748b" }}>
            Practice mock interviews and receive AI-powered feedback and coaching.
          </p>
        </div>
      </section>
    </main>
  )
}