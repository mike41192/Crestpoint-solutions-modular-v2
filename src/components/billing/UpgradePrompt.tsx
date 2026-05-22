import type { MembershipTier } from "@/types/modules"

type UpgradePromptProps = {
  requiredTier: MembershipTier
}

export function UpgradePrompt({
  requiredTier,
}: UpgradePromptProps) {
  return (
    <div
      style={{
        marginTop: "16px",
        border: "1px solid #fde68a",
        borderRadius: "16px",
        padding: "16px",
        background: "#fffbeb",
      }}
    >
      <h3
        style={{
          fontSize: "18px",
          fontWeight: 700,
          color: "#92400e",
        }}
      >
        Upgrade Required
      </h3>

      <p
        style={{
          marginTop: "8px",
          color: "#78350f",
          lineHeight: 1.5,
        }}
      >
        This feature requires the{" "}
        <strong style={{ textTransform: "capitalize" }}>
          {requiredTier}
        </strong>{" "}
        membership tier or higher.
      </p>

      <a
        href="/pricing"
        style={{
          display: "inline-block",
          marginTop: "14px",
          padding: "10px 16px",
          borderRadius: "12px",
          background: "#f59e0b",
          color: "#ffffff",
          textDecoration: "none",
          fontWeight: 700,
        }}
      >
        View Pricing Plans
      </a>
    </div>
  )
}