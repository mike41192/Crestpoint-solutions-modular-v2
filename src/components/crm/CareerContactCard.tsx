"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import { Building2, CalendarClock, Mail, Pencil, Trash2, User } from "lucide-react"
import type { CareerContactRecord } from "@/modules/career-crm"

// =====================================================
// BLOCK: Component Types
// =====================================================

type CareerContactCardProps = {
  contact: CareerContactRecord
  onOpen: (contact: CareerContactRecord) => void
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
  if (!value) return "No follow-up set"

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

// =====================================================
// BLOCK: Career Contact Card
// =====================================================

export function CareerContactCard({
  contact,
  onOpen,
  onEdit,
  onDelete,
}: CareerContactCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={() => onOpen(contact)}
          className="min-w-0 text-left"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <User size={20} />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-lg font-black text-slate-950">
                {contact.name}
              </h3>

              <p className="mt-1 truncate text-sm font-bold text-slate-500">
                {[contact.role, contact.company].filter(Boolean).join(" at ") ||
                  formatLabel(contact.contact_type)}
              </p>
            </div>
          </div>
        </button>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => onEdit(contact)}
            aria-label={`Edit ${contact.name}`}
            className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(contact)}
            aria-label={`Delete ${contact.name}`}
            className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase text-slate-600">
          {formatLabel(contact.contact_type)}
        </span>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black uppercase text-blue-700">
          {formatLabel(contact.relationship_status)}
        </span>
      </div>

      <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-600">
        {contact.company && (
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-slate-400" />
            <span className="truncate">{contact.company}</span>
          </div>
        )}

        {contact.email && (
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-slate-400" />
            <span className="truncate">{contact.email}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <CalendarClock size={16} className="text-slate-400" />
          <span>{formatDate(contact.follow_up_at)}</span>
        </div>
      </div>
    </article>
  )
}
