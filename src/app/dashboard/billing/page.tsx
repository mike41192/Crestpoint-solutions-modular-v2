import {
  BarChart3,
  CreditCard,
  Crown,
  Gauge,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { ModulePageLayout } from "@/components/layout/ModulePageLayout"

const billingSections = [
  {
    title: "Current Membership",
    description:
      "Review the currently active membership tier and billing status.",
    icon: Crown,
    status: "Active",
  },
  {
    title: "Usage Limits",
    description:
      "Track AI credits, scans, exports, interview sessions, and uploads.",
    icon: Gauge,
    status: "Tracked",
  },
  {
    title: "Upgrade Plan",
    description:
      "Upgrade to higher membership tiers for expanded access and AI usage.",
    icon: Sparkles,
    status: "Available",
  },
  {
    title: "Billing Portal",
    description:
      "Future Stripe billing portal integration for subscription management.",
    icon: CreditCard,
    status: "Stripe",
  },
]

export default function BillingDashboardPage() {
  return (
    <ModulePageLayout
      title="Billing Dashboard"
      description="Review subscription access, usage limits, membership tiers, and billing controls."
    >
      <div className="grid gap-6">
        <section className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <ShieldCheck size={14} />
                Membership Control Center
              </div>

              <h2 className="text-2xl font-black tracking-tight">
                Manage access and usage
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Monitor subscription access, AI usage, credits, exports, and
                future Stripe billing controls.
              </p>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100">
                Billing Status
              </p>
              <p className="mt-2 text-lg font-black">Membership Active</p>
              <p className="mt-1 text-sm text-slate-300">
                Live Stripe portal controls can be connected here.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {billingSections.map((section) => {
            const Icon = section.icon

            return (
              <article
                key={section.title}
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-700 w-fit">
                  <Icon size={20} />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-black text-slate-950">
                    {section.title}
                  </h2>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-extrabold text-slate-600">
                    {section.status}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {section.description}
                </p>
              </article>
            )
          })}
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
              <BarChart3 size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-950">
                Usage Snapshot
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                This area is ready for live usage data once credit tracking,
                exports, scans, and AI requests are connected to Supabase.
              </p>
            </div>
          </div>
        </section>
      </div>
    </ModulePageLayout>
  )
}
