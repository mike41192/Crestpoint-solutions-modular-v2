import Link from "next/link"
import {
  ArrowRight,
  Bot,
  Brush,
  CreditCard,
  Database,
  Gauge,
  GitBranch,
  Layers3,
  LockKeyhole,
  PackageCheck,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react"

const settingsGroups = [
  {
    title: "Core Configuration",
    description: "App behavior, modules, tiers, pricing, and user-facing controls.",
    items: [
      {
        title: "General",
        description: "Core system settings and product configuration.",
        href: "/admin/settings/general",
        icon: Settings,
      },
      {
        title: "Appearance",
        description: "Review global appearance settings and layout options.",
        href: "/admin/settings/appearance",
        icon: Brush,
      },
      {
        title: "Modules",
        description: "Enable modules and manage access requirements.",
        href: "/admin/settings/modules",
        icon: Layers3,
      },
      {
        title: "Membership Tiers",
        description: "Review tier rules, hierarchy, and admin access behavior.",
        href: "/admin/settings/tiers",
        icon: ShieldCheck,
      },
      {
        title: "Pricing",
        description: "Review membership pricing and Stripe price mappings.",
        href: "/admin/settings/pricing",
        icon: CreditCard,
      },
    ],
  },
  {
    title: "Access Management",
    description: "User access, usage limits, module access tests, and owner controls.",
    items: [
      {
        title: "Users",
        description: "Manage user access, membership tiers, and admin overrides.",
        href: "/admin/settings/users",
        icon: Users,
      },
      {
        title: "Usage Limits",
        description: "Review monthly limits and usage enforcement settings.",
        href: "/admin/settings/usage",
        icon: Gauge,
      },
      {
        title: "Access Test",
        description: "Verify module access rules across membership tiers.",
        href: "/admin/settings/access-test",
        icon: LockKeyhole,
      },
    ],
  },
  {
    title: "Integrations",
    description: "External services, deployment readiness, and billing diagnostics.",
    items: [
      {
        title: "Billing Status",
        description: "Check Stripe keys, price IDs, and billing readiness.",
        href: "/admin/settings/billing-status",
        icon: CreditCard,
      },
      {
        title: "Supabase Status",
        description: "Check database, auth, RLS, and environment readiness.",
        href: "/admin/settings/supabase-status",
        icon: Database,
      },
      {
        title: "Vercel Status",
        description: "Review deployment and hosting configuration.",
        href: "/admin/settings/vercel-status",
        icon: PackageCheck,
      },
      {
        title: "GitHub Status",
        description: "Check repository configuration and backup readiness.",
        href: "/admin/settings/github-status",
        icon: GitBranch,
      },
    ],
  },
  {
    title: "Operations",
    description: "Security, backup checkpoints, registry health, and cleanup controls.",
    items: [
      {
        title: "Security Status",
        description: "Review secret handling, environment safety, and security rules.",
        href: "/admin/settings/security-status",
        icon: ShieldCheck,
      },
      {
        title: "Backup Status",
        description: "Review rollback rules and stable checkpoint guidance.",
        href: "/admin/settings/backup-status",
        icon: PackageCheck,
      },
      {
        title: "Module Registry",
        description: "Track stable module checkpoints and rollback-safe versions.",
        href: "/admin/settings/module-registry",
        icon: Layers3,
      },
      {
        title: "Deprecated Files",
        description: "Track outdated files and cleanup candidates.",
        href: "/admin/settings/deprecated-files",
        icon: Wrench,
      },
      {
        title: "Cleanup Checklist",
        description: "Verify safe cleanup procedures before deleting files.",
        href: "/admin/settings/cleanup-checklist",
        icon: SlidersHorizontal,
      },
      {
        title: "System Status",
        description: "Review billing, AI, module gating, and platform readiness.",
        href: "/admin/settings/system-status",
        icon: Gauge,
      },
    ],
  },
  {
    title: "AI Systems",
    description: "AI readiness, quality controls, and prompt-system health.",
    items: [
      {
        title: "AI Quality",
        description: "Review AI performance and prompt quality controls.",
        href: "/admin/settings/ai-quality",
        icon: Sparkles,
      },
      {
        title: "AI Status",
        description: "Check OpenAI configuration and AI system readiness.",
        href: "/admin/settings/ai-status",
        icon: Bot,
      },
      {
        title: "Advanced",
        description: "Developer and system controls for owner-level operations.",
        href: "/admin/settings/advanced",
        icon: SlidersHorizontal,
      },
    ],
  },
]

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-6 lg:px-8">
      <div className="mx-auto grid max-w-[1500px] gap-6">
        <section className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div>
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <Settings size={14} />
                Admin Settings
              </div>

              <h1 className="text-3xl font-black tracking-tight">
                Manage Crestpoint from one control center
              </h1>

              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
                Settings are grouped by workflow so owner tasks are easier to
                scan: core configuration, access, integrations, operations, and
                AI systems.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/15 bg-white/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100">
                Owner Access
              </p>

              <h2 className="mt-2 text-xl font-black">
                Admin tier grants unlimited module access
              </h2>

              <Link
                href="/admin/settings/users"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-400"
              >
                Manage Users
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <div className="grid gap-6">
          {settingsGroups.map((group) => (
            <section
              key={group.title}
              className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                    {group.title}
                  </p>

                  <h2 className="mt-1 text-xl font-black text-slate-950">
                    {group.description}
                  </h2>
                </div>

                <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                  {group.items.length} tools
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {group.items.map((item) => {
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group rounded-[24px] border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-2xl bg-white p-3 text-blue-700 shadow-sm transition group-hover:bg-blue-600 group-hover:text-white">
                          <Icon size={18} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-black text-slate-950">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
