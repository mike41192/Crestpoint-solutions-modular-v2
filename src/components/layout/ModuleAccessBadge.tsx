import type { MembershipTier } from "@/types/modules"

type ModuleAccessBadgeProps = {
  tier: MembershipTier
}

const tierStyles: Record<MembershipTier, { label: string; bg: string; color: string }> = {
  free: {
    label: "Free",
    bg: "#dcfce7",
    color: "#166534",
  },
  starter: {
    label: "Starter",
    bg: "#e0f2fe",
    color: "#075985",
  },
  pro: {
    label: "Pro",
    bg: "#ede9fe",
    color: "#5b21b6",
  },
  premium: {
    label: "Premium",
    bg: "#fef3c7",
    color: "#92400e",
  },
  business: {
    label: "Business",
    bg: "#fce7f3",
    color: "#9d174d",
  },
  admin: {
    label: "Admin",
    bg: "#fee2e2",
    color: "#991b1b",
  },
}

export function ModuleAccessBadge({ tier }: ModuleAccessBadgeProps) {
  const style = tierStyles[tier]

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "999px",
        padding: "4px 10px",
        fontSize: "12px",
        fontWeight: 700,
        background: style.bg,
        color: style.color,
        textTransform: "uppercase",
        letterSpacing: "0.03em",
      }}
    >
      {style.label}
    </span>
  )
}