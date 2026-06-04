"use client"

// =====================================================
// BLOCK: Icon Imports
// =====================================================

import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ListChecks,
  SearchCheck,
  Sparkles,
  Wrench,
} from "lucide-react"

// =====================================================
// BLOCK: ATS Tab Types
// =====================================================

export type ATSDashboardTab =
  | "overview"
  | "keywords"
  | "gaps"
  | "risks"
  | "recommendations"
  | "apply"
  | "validation"

type ATSDashboardTabsProps = {
  activeTab: ATSDashboardTab
  onTabChange: (tab: ATSDashboardTab) => void
}

// =====================================================
// BLOCK: ATS Tab Configuration
// =====================================================

const tabs: {
  id: ATSDashboardTab
  label: string
  icon: React.ComponentType<{ size?: number }>
}[] = [
  {
    id: "overview",
    label: "Overview",
    icon: BarChart3,
  },
  {
    id: "keywords",
    label: "Keywords",
    icon: SearchCheck,
  },
  {
    id: "gaps",
    label: "Gap Analysis",
    icon: ListChecks,
  },
  {
    id: "risks",
    label: "Risk Flags",
    icon: AlertTriangle,
  },
  {
    id: "recommendations",
    label: "Recommendations",
    icon: Sparkles,
  },
  {
    id: "apply",
    label: "Apply Fixes",
    icon: CheckCircle2,
  },
  {
    id: "validation",
    label: "Validation",
    icon: Wrench,
  },
]

// =====================================================
// BLOCK: ATS Dashboard Tabs Component
// =====================================================

export function ATSDashboardTabs({
  activeTab,
  onTabChange,
}: ATSDashboardTabsProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="grid min-w-max grid-cols-7 gap-3 xl:min-w-0">
        {tabs.map((tab) => {
          const Icon = tab.icon

          const active =
            activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                px-4
                py-3
                text-sm
                font-extrabold
                transition
                ${
                  active
                    ? "border-violet-600 bg-violet-50 text-violet-700"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
                }
              `}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
