import { modulesConfig } from "@/lib/config/modules.config"
import { tierRank } from "@/lib/config/tiers.config"
import type { MembershipTier, ModuleKey } from "@/types/modules"

type CanUseModuleInput = {
  userTier: MembershipTier
  moduleKey: ModuleKey
  isAdmin?: boolean
}

export function canUseModule({
  userTier,
  moduleKey,
  isAdmin = false,
}: CanUseModuleInput) {
  if (isAdmin || userTier === "admin") {
    return {
      allowed: true,
      reason: "Admin access granted.",
    }
  }

  const module = modulesConfig.find((item) => item.key === moduleKey)

  if (!module) {
    return {
      allowed: false,
      reason: "Module does not exist.",
    }
  }

  if (!module.enabled) {
    return {
      allowed: false,
      reason: "Module is currently disabled.",
    }
  }

  const userRank = tierRank[userTier]
  const requiredRank = tierRank[module.requiredTier]

  if (userRank < requiredRank) {
    return {
      allowed: false,
      reason: `Requires ${module.requiredTier} tier or higher.`,
    }
  }

  return {
    allowed: true,
    reason: "Access granted.",
  }
}