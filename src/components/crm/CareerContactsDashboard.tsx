"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

import { useEffect, useMemo, useState } from "react"
import { Plus, Search, Users } from "lucide-react"
import { CareerContactCard } from "@/components/crm/CareerContactCard"
import { CareerContactDetailDrawer } from "@/components/crm/CareerContactDetailDrawer"
import { CareerContactForm } from "@/components/crm/CareerContactForm"
import {
  createCareerContact,
  deleteCareerContact,
  listCareerContacts,
  updateCareerContact,
  type CareerContactPayload,
  type CareerContactRecord,
  type CareerContactType,
  type CareerRelationshipStatus,
} from "@/modules/career-crm"

// =====================================================
// BLOCK: Constants
// =====================================================

const contactTypeFilters: Array<{
  value: CareerContactType | "all"
  label: string
}> = [
  { value: "all", label: "All Types" },
  { value: "recruiter", label: "Recruiters" },
  { value: "hiring_manager", label: "Hiring Managers" },
  { value: "networking", label: "Networking" },
  { value: "coworker", label: "Coworkers" },
  { value: "mentor", label: "Mentors" },
  { value: "other", label: "Other" },
]

const statusFilters: Array<{
  value: CareerRelationshipStatus | "all"
  label: string
}> = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "active", label: "Active" },
  { value: "follow_up", label: "Follow Up" },
  { value: "closed", label: "Closed" },
]

// =====================================================
// BLOCK: Career Contacts Dashboard
// =====================================================

export function CareerContactsDashboard() {
  const [contacts, setContacts] = useState<CareerContactRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<CareerContactType | "all">("all")
  const [statusFilter, setStatusFilter] = useState<
    CareerRelationshipStatus | "all"
  >("all")
  const [formOpen, setFormOpen] = useState(false)
  const [editingContact, setEditingContact] =
    useState<CareerContactRecord | null>(null)
  const [selectedContact, setSelectedContact] =
    useState<CareerContactRecord | null>(null)

  // =====================================================
  // BLOCK: Load Records
  // =====================================================

  async function loadContacts() {
    setLoading(true)
    setMessage("")

    const records = await listCareerContacts()

    setContacts(records)
    setLoading(false)
  }

  useEffect(() => {
    loadContacts()
  }, [])

  // =====================================================
  // BLOCK: Derived Records
  // =====================================================

  const filteredContacts = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return contacts.filter((contact) => {
      const matchesSearch =
        !searchValue ||
        [
          contact.name,
          contact.company,
          contact.role,
          contact.email,
          contact.phone,
          contact.linkedin_url,
          contact.contact_type,
          contact.relationship_status,
          contact.notes,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(searchValue)

      const matchesType =
        typeFilter === "all" || contact.contact_type === typeFilter

      const matchesStatus =
        statusFilter === "all" ||
        contact.relationship_status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
  }, [contacts, search, statusFilter, typeFilter])

  const followUpCount = contacts.filter((contact) => {
    return contact.relationship_status === "follow_up" || contact.follow_up_at
  }).length

  // =====================================================
  // BLOCK: Form Handlers
  // =====================================================

  function openCreateForm() {
    setEditingContact(null)
    setSelectedContact(null)
    setFormOpen(true)
    setMessage("")
  }

  function openEditForm(contact: CareerContactRecord) {
    setEditingContact(contact)
    setSelectedContact(null)
    setFormOpen(true)
    setMessage("")
  }

  function closeForm() {
    setEditingContact(null)
    setFormOpen(false)
    setSaving(false)
  }

  async function handleSubmit(payload: CareerContactPayload) {
    setSaving(true)
    setMessage("")

    const result = editingContact
      ? await updateCareerContact({
          ...payload,
          id: editingContact.id,
        })
      : await createCareerContact(payload)

    if (result.status !== "success") {
      setMessage(result.message || "Unable to save career contact.")
      setSaving(false)
      return
    }

    setMessage(editingContact ? "Career contact updated." : "Career contact saved.")

    closeForm()
    await loadContacts()
  }

  async function handleDelete(contact: CareerContactRecord) {
    const confirmed = window.confirm(
      `Delete "${contact.name}"? This cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    const result = await deleteCareerContact(contact.id)

    if (result.status !== "success") {
      setMessage(result.message || "Unable to delete career contact.")
      return
    }

    if (selectedContact?.id === contact.id) {
      setSelectedContact(null)
    }

    setMessage("Career contact deleted.")
    await loadContacts()
  }

  // =====================================================
  // BLOCK: Render
  // =====================================================

  return (
    <section className="grid gap-5">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
            <Users size={22} />
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
              Career CRM
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Relationship Pipeline
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Manage the recruiters, hiring managers, mentors, coworkers, and
              networking contacts connected to your job search.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
        >
          <Plus size={17} />
          Add Contact
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
            Total Contacts
          </p>
          <p className="mt-2 text-3xl font-black text-slate-950">
            {contacts.length}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
            Active Relationships
          </p>
          <p className="mt-2 text-3xl font-black text-slate-950">
            {
              contacts.filter((contact) => contact.relationship_status === "active")
                .length
            }
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
            Follow-Ups
          </p>
          <p className="mt-2 text-3xl font-black text-slate-950">
            {followUpCount}
          </p>
        </div>
      </div>

      <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[minmax(0,1fr)_220px_220px]">
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <Search size={17} className="text-slate-400" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search contacts by name, company, role, notes..."
            className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
          />
        </label>

        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(event.target.value as CareerContactType | "all")
          }
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        >
          {contactTypeFilters.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as CareerRelationshipStatus | "all",
            )
          }
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        >
          {statusFilters.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {message && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">
          {message}
        </div>
      )}

      {formOpen && (
        <CareerContactForm
          key={editingContact?.id || "new-contact"}
          initialContact={editingContact}
          saving={saving}
          onCancel={closeForm}
          onSubmit={handleSubmit}
        />
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm font-bold text-slate-500 shadow-sm">
          Loading career contacts...
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
          <h3 className="text-xl font-black text-slate-950">
            No career contacts found
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Add your first recruiter, hiring manager, mentor, coworker, or
            networking contact to start building your relationship system.
          </p>

          <button
            type="button"
            onClick={openCreateForm}
            className="mt-5 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
          >
            Add Contact
          </button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredContacts.map((contact) => (
            <CareerContactCard
              key={contact.id}
              contact={contact}
              onOpen={setSelectedContact}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {selectedContact && (
        <CareerContactDetailDrawer
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      )}
    </section>
  )
}
