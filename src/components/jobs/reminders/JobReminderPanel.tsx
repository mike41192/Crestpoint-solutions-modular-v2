"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.6
// =====================================================

import { ArrowRight, BellRing, Clock } from "lucide-react"
import { analyzeJobReminders } from "@/modules/job-reminders"
import type { JobApplicationRecord } from "@/modules/job-tracker"

// =====================================================
// BLOCK: Component Types
// =====================================================

type JobReminderPanelProps = {
  applications: JobApplicationRecord[]
  onOpenApplication?: (application: JobApplicationRecord) => void
}

// =====================================================
// BLOCK: Job Reminder Panel
// =====================================================

export function JobReminderPanel({
  applications,
  onOpenApplication,
}: JobReminderPanelProps) {
  const reminders = analyzeJobReminders(applications)
  const overdueCount = reminders.filter((reminder) => {
    return reminder.status === "overdue"
  }).length
  const dueTodayCount = reminders.filter((reminder) => {
    return reminder.status === "due_today"
  }).length

  return (
    <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-4 border-b border-slate-100 p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-amber-50 p-3 text-amber-700">
            <BellRing size={20} />
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-600">
              Follow-Up Reminders
            </p>

            <h3 className="mt-2 text-xl font-black text-slate-950">
              Action Queue
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Stay consistent with follow-ups and prevent applications from
              going cold.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <ReminderStat label="Overdue" value={overdueCount} tone="red" />
          <ReminderStat label="Today" value={dueTodayCount} tone="amber" />
          <ReminderStat label="Total" value={reminders.length} tone="blue" />
        </div>
      </div>

      {reminders.length === 0 ? (
        <div className="m-5 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm font-bold text-slate-500">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white p-3 text-slate-400 shadow-sm">
              <Clock size={18} />
            </div>

            <span>No upcoming follow-up reminders yet.</span>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 p-5">
          {reminders.slice(0, 8).map((reminder) => (
            <button
              key={reminder.application.id}
              type="button"
              onClick={() => onOpenApplication?.(reminder.application)}
              className="group rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-left transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-amber-50"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-950">
                    {reminder.application.title}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {reminder.application.company || "Company not listed"}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full border px-3 py-1 text-[11px] font-black ${
                    reminder.status === "overdue"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : reminder.status === "due_today"
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-blue-200 bg-blue-50 text-blue-700"
                  }`}
                >
                  {reminder.label}
                </span>
              </div>

              <div className="mt-3 flex items-end justify-between gap-3">
                {reminder.application.next_action ? (
                  <p className="line-clamp-2 text-xs font-semibold leading-5 text-slate-600">
                    {reminder.application.next_action}
                  </p>
                ) : (
                  <p className="text-xs font-semibold text-slate-400">
                    No next action saved.
                  </p>
                )}

                <ArrowRight
                  size={15}
                  className="shrink-0 text-slate-300 transition group-hover:text-amber-600"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

function ReminderStat({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: "red" | "amber" | "blue"
}) {
  const toneClass = {
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
  }[tone]

  return (
    <div className={`rounded-2xl px-3 py-2 ${toneClass}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.12em]">
        {label}
      </p>

      <p className="mt-0.5 text-lg font-black">{value}</p>
    </div>
  )
}
