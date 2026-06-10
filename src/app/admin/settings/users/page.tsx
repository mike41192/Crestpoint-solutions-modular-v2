import {
  CheckCircle2,
  CopyCheck,
  Crown,
  Database,
  Gauge,
  ShieldCheck,
  UserCog,
} from "lucide-react"

const adminAccessSteps = [
  {
    title: "Add your email to ADMIN_EMAILS",
    description:
      "Admin API routes use the ADMIN_EMAILS environment variable for owner-only access.",
  },
  {
    title: "Promote your membership row",
    description:
      "Set plan_name to admin, status to active, and feature limits to -1 for unlimited access.",
  },
  {
    title: "Restart and sign in again",
    description:
      "Restart the app after env changes, then sign out and back in so auth and membership state reload.",
  },
]

const adminCapabilities = [
  "Admin tools module access",
  "Unlimited saved resumes",
  "Unlimited ATS scans",
  "Unlimited AI rewrites",
  "Module access override through admin tier",
  "Owner diagnostics and status pages",
]

export default function UsersSettingsPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-6 lg:px-8">
      <div className="mx-auto grid max-w-[1300px] gap-6">
        <section className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div>
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <UserCog size={14} />
                User Access
              </div>

              <h1 className="text-3xl font-black tracking-tight">
                Manage owner access and membership overrides
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                Admin access is intentionally split between environment-level
                authorization and database membership limits so platform control
                stays explicit.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/15 bg-white/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100">
                Admin Tier
              </p>

              <h2 className="mt-2 text-xl font-black">
                Unlimited access uses the `admin` membership tier
              </h2>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start gap-3">
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                <ShieldCheck size={20} />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                  Owner Promotion
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-950">
                  Safe admin setup checklist
                </h2>
              </div>
            </div>

            <div className="grid gap-3">
              {adminAccessSteps.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                      {index + 1}
                    </span>

                    <div>
                      <h3 className="font-black text-slate-950">
                        {step.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[32px] border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <div className="rounded-2xl bg-white p-3 text-emerald-700 shadow-sm w-fit">
              <Crown size={22} />
            </div>

            <h2 className="mt-4 text-xl font-black text-emerald-950">
              Admin Unlimited Access
            </h2>

            <div className="mt-4 grid gap-2">
              {adminCapabilities.map((capability) => (
                <div
                  key={capability}
                  className="flex items-center gap-2 text-sm font-bold text-emerald-800"
                >
                  <CheckCircle2 size={16} className="shrink-0" />
                  {capability}
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start gap-3">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
              <Database size={20} />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                Supabase SQL
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-950">
                Local SQL backup file created for owner promotion
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Use the SQL file in Supabase after replacing the email value.
                Then add the same email to `ADMIN_EMAILS`.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <InfoCard
              icon={CopyCheck}
              title="SQL File"
              value="supabase/admin-promote-owner.sql"
            />

            <InfoCard
              icon={Gauge}
              title="Unlimited Limit"
              value="-1"
            />

            <InfoCard
              icon={Crown}
              title="Plan Name"
              value="admin"
            />
          </div>
        </section>
      </div>
    </main>
  )
}

function InfoCard({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  value: string
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-white p-3 text-blue-700 shadow-sm">
          <Icon size={18} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            {title}
          </p>

          <p className="mt-1 break-words text-sm font-black text-slate-950">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}
