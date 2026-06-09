"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import {
  Building2,
  CalendarClock,
  ExternalLink,
  Mail,
  Pencil,
  Phone,
  Trash2,
  User,
  X,
} from "lucide-react"
import type { CareerContactRecord } from "@/modules/career-crm"

// =====================================================
// BLOCK: Component Types
// =====================================================

type CareerContactDetailDrawerProps = {
  contact: CareerContactRecord
  onClose: () => void
  onEdit: (contact: CareerContactRecord) => void
  onDelete: (contact: CareerContactRecord) => void
}

// =====================================================
// BLOCK: Helpers
// =====================================================

function formatLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function formatDate(value: string | null) {
  if (!value) return "Not set"

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

// =====================================================
// BLOCK: Career Contact Detail Drawer
// =====================================================

export function CareerContactDetailDrawer({
  contact,
  onClose,
  onEdit,
  onDelete,
}: CareerContactDetailDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 p-3 backdrop-blur-sm">
      <aside className="flex h-full w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <header className="border-b border-slate-200 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <User size={22} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                  Career Contact
                </p>

                <h2 className="mt-2 truncate text-2xl font-black text-slate-950">
                  {contact.name}
                </h2>

                <p className="mt-1 truncate text-sm font-bold text-slate-500">
                  {[contact.role, contact.company].filter(Boolean).join(" at ") ||
                    formatLabel(contact.contact_type)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close contact details"
              className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase text-slate-600">
              {formatLabel(contact.contact_type)}
            </span>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black uppercase text-blue-700">
              {formatLabel(contact.relationship_status)}
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid gap-3">
            {contact.company && (
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700">
                <Building2 size={17} className="text-slate-400" />
                {contact.company}
              </div>
            )}

            {contact.email && (
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700">
                <Mail size={17} className="text-slate-400" />
                {contact.email}
              </div>
            )}

            {contact.phone && (
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700">
                <Phone size={17} className="text-slate-400" />
                {contact.phone}
              </div>
            )}

            {contact.linkedin_url && (
              <a
                href={contact.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-blue-700 transition hover:border-blue-200 hover:bg-blue-50"
              >
                <ExternalLink size={17} />
                Open LinkedIn profile
              </a>
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                <CalendarClock size={15} />
                Last Contacted
              </div>

              <p className="mt-2 text-sm font-black text-slate-800">
                {formatDate(contact.last_contacted_at)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                <CalendarClock size={15} />
                Follow-Up
              </div>

              <p className="mt-2 text-sm font-black text-slate-800">
                {formatDate(contact.follow_up_at)}
              </p>
            </div>
          </div>

          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
              Notes
            </p>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {contact.notes || "No notes saved for this contact yet."}
            </p>
          </section>
        </div>

        <footer className="flex flex-wrap gap-3 border-t border-slate-200 p-5">
          <button
            type="button"
            onClick={() => onEdit(contact)}
            className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(contact)}
            className="flex items-center gap-2 rounded-full border border-red-200 bg-white px-5 py-3 text-sm font-black text-red-700 transition hover:bg-red-50"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </footer>
      </aside>
    </div>
  )
}
