"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import { useState, type FormEvent } from "react"
import type {
  CareerContactPayload,
  CareerContactRecord,
  CareerContactType,
  CareerRelationshipStatus,
} from "@/modules/career-crm"

// =====================================================
// BLOCK: Constants
// =====================================================

const contactTypeOptions: Array<{ value: CareerContactType; label: string }> = [
  { value: "recruiter", label: "Recruiter" },
  { value: "hiring_manager", label: "Hiring Manager" },
  { value: "networking", label: "Networking" },
  { value: "coworker", label: "Coworker" },
  { value: "mentor", label: "Mentor" },
  { value: "other", label: "Other" },
]

const relationshipStatusOptions: Array<{
  value: CareerRelationshipStatus
  label: string
}> = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "active", label: "Active" },
  { value: "follow_up", label: "Follow Up" },
  { value: "closed", label: "Closed" },
]

// =====================================================
// BLOCK: Component Types
// =====================================================

type CareerContactFormProps = {
  initialContact?: CareerContactRecord | null
  saving: boolean
  onCancel: () => void
  onSubmit: (payload: CareerContactPayload) => Promise<void>
}

// =====================================================
// BLOCK: Helpers
// =====================================================

function toDateInputValue(value: string | null | undefined) {
  if (!value) return ""

  return value.slice(0, 10)
}

// =====================================================
// BLOCK: Career Contact Form
// =====================================================

export function CareerContactForm({
  initialContact,
  saving,
  onCancel,
  onSubmit,
}: CareerContactFormProps) {
  const [name, setName] = useState(initialContact?.name || "")
  const [company, setCompany] = useState(initialContact?.company || "")
  const [role, setRole] = useState(initialContact?.role || "")
  const [email, setEmail] = useState(initialContact?.email || "")
  const [phone, setPhone] = useState(initialContact?.phone || "")
  const [linkedinUrl, setLinkedinUrl] = useState(
    initialContact?.linkedin_url || "",
  )
  const [contactType, setContactType] = useState<CareerContactType>(
    initialContact?.contact_type || "recruiter",
  )
  const [relationshipStatus, setRelationshipStatus] =
    useState<CareerRelationshipStatus>(
      initialContact?.relationship_status || "new",
    )
  const [lastContactedAt, setLastContactedAt] = useState(
    toDateInputValue(initialContact?.last_contacted_at),
  )
  const [followUpAt, setFollowUpAt] = useState(
    toDateInputValue(initialContact?.follow_up_at),
  )
  const [notes, setNotes] = useState(initialContact?.notes || "")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim()) return

    await onSubmit({
      id: initialContact?.id,
      name,
      company,
      role,
      email,
      phone,
      linkedinUrl,
      contactType,
      relationshipStatus,
      notes,
      lastContactedAt: lastContactedAt || null,
      followUpAt: followUpAt || null,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-black text-slate-950">
          {initialContact ? "Edit Career Contact" : "Add Career Contact"}
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Store the people connected to your search: recruiters, hiring
          managers, mentors, coworkers, and networking relationships.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-black text-slate-700">
          Name

          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Jordan Lee"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="text-sm font-black text-slate-700">
          Company

          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            placeholder="Northstar Manufacturing"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="text-sm font-black text-slate-700">
          Role

          <input
            value={role}
            onChange={(event) => setRole(event.target.value)}
            placeholder="Senior Recruiter"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="text-sm font-black text-slate-700">
          Email

          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="jordan@example.com"
            type="email"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="text-sm font-black text-slate-700">
          Phone

          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="(555) 123-4567"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="text-sm font-black text-slate-700">
          LinkedIn URL

          <input
            value={linkedinUrl}
            onChange={(event) => setLinkedinUrl(event.target.value)}
            placeholder="https://linkedin.com/in/..."
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="text-sm font-black text-slate-700">
          Contact Type

          <select
            value={contactType}
            onChange={(event) =>
              setContactType(event.target.value as CareerContactType)
            }
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          >
            {contactTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-black text-slate-700">
          Relationship Status

          <select
            value={relationshipStatus}
            onChange={(event) =>
              setRelationshipStatus(
                event.target.value as CareerRelationshipStatus,
              )
            }
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          >
            {relationshipStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-black text-slate-700">
          Last Contacted

          <input
            value={lastContactedAt}
            onChange={(event) => setLastContactedAt(event.target.value)}
            type="date"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="text-sm font-black text-slate-700">
          Follow-Up Date

          <input
            value={followUpAt}
            onChange={(event) => setFollowUpAt(event.target.value)}
            type="date"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="text-sm font-black text-slate-700 md:col-span-2">
          Notes

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Conversation notes, referral context, reminders, preferences, and relationship history."
            className="mt-2 min-h-[130px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {saving ? "Saving..." : initialContact ? "Update Contact" : "Save Contact"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
