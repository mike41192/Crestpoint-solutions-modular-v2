import type { MembershipTier } from "@/types/modules"

type LockedModuleNoticeProps = {
  requiredTier: MembershipTier
  reason: string
}

export function LockedModuleNotice({
  requiredTier,
  reason,
}: LockedModuleNoticeProps) {
  return (
    <div
      style={{
        marginTop: "12px",
        border: "1px solid #fde68a",
        borderRadius: "12px",
        padding: "12px",
        background: "#fffbeb",
        color: "#92400e",
        fontSize: "14px",
      }}
    >
      <strong>Upgrade required</strong>

      <p style={{ marginTop: "4px" }}>
        {reason} Required tier:{" "}
        <span style={{ textTransform: "capitalize" }}>{requiredTier}</span>.
      </p>
    </div>
  )
}