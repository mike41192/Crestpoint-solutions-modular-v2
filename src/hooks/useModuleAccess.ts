import { getModuleAccess } from "@/lib/access/getModuleAccess"
import type { MembershipTier, ModuleKey } from "@/types/modules"

type UseModuleAccessInput = {
  userTier: MembershipTier
  moduleKey: ModuleKey
  isAdmin?: boolean
}

export function useModuleAccess({
  userTier,
  moduleKey,
  isAdmin = false,
}: UseModuleAccessInput) {
  return getModuleAccess({
    userTier,
    moduleKey,
    isAdmin,
  })
}