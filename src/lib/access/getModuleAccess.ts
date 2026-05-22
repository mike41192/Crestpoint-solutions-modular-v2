import { modulesConfig } from "@/lib/config/modules.config"
import { canUseModule } from "@/lib/access/canUseModule"
import type { MembershipTier, ModuleKey } from "@/types/modules"

type GetModuleAccessInput = {
  userTier: MembershipTier
  moduleKey: ModuleKey
  isAdmin?: boolean
}

export function getModuleAccess({
  userTier,
  moduleKey,
  isAdmin = false,
}: GetModuleAccessInput) {
  const module = modulesConfig.find((item) => item.key === moduleKey)

  const access = canUseModule({
    userTier,
    moduleKey,
    isAdmin,
  })

  return {
    module,
    access,
  }
}