"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.6
// =====================================================

import { Clock } from "lucide-react"
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

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-amber-50 p-3 text-amber-700">
          <Clock size={20} />
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-600">
            Follow-Up Reminders
          </p>

          <h3 className="mt-2 text-xl font-black text-slate-950">
            Action Queue
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Stay consistent with follow-ups and prevent applications from going
            cold.
          </p>
        </div>
      </div>

      {reminders.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-bold text-slate-500">
          No upcoming follow-up reminders yet.
        </div>
      ) : (
        <div className="mt-5 grid gap-3">
          {reminders.slice(0, 8).map((reminder) => (
            <button
              key={reminder.application.id}
              type="button"
              onClick={() => onOpenApplication?.(reminder.application)}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-amber-200 hover:bg-amber-50"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
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

              {reminder.application.next_action && (
                <p className="mt-3 text-xs leading-5 text-slate-600">
                  {reminder.application.next_action}
                </p>
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}