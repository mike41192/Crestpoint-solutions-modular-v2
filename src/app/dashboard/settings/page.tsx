import {
  Bell,
  CreditCard,
  Lock,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import { ModulePageLayout } from "@/components/layout/ModulePageLayout"

const accountSections = [
  {
    title: "Profile Information",
    description:
      "Manage personal details, career goals, contact information, and profile preferences.",
    icon: UserRound,
    status: "Active",
  },
  {
    title: "Membership Access",
    description:
      "Review your current tier and which Crestpoint modules are available to your account.",
    icon: CreditCard,
    status: "Connected",
  },
  {
    title: "Notification Preferences",
    description:
      "Future controls for email updates, reminders, job alerts, and interview prep notifications.",
    icon: Bell,
    status: "Planned",
  },
  {
    title: "Security",
    description:
      "Future Supabase authentication controls for login, sessions, and account protection.",
    icon: Lock,
    status: "Protected",
  },
]

export default function AccountSettingsPage() {
  return (
    <ModulePageLayout
      title="Account Settings"
      description="Manage your profile, membership access, notifications, and account security."
    >
      <div className="grid gap-6">
        <section className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                <ShieldCheck size={14} />
                Account Control Center
              </div>

              <h2 className="text-2xl font-black tracking-tight">
                Your Crestpoint account
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Keep your profile, access level, preferences, and security
                controls organized in one place.
              </p>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100">
                Current Status
              </p>
              <p className="mt-2 text-lg font-black">Account Active</p>
              <p className="mt-1 text-sm text-slate-300">
                Module access managed by your membership tier.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          {accountSections.map((section) => {
            const Icon = section.icon

            return (
              <article
                key={section.title}
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                    <Icon size={20} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
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
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      </div>
    </ModulePageLayout>
  )
}
