"use client"

// =====================================================
// BLOCK: React Imports
// =====================================================

import { useEffect, useState } from "react"

// =====================================================
// BLOCK: Profile Management Imports
// =====================================================

import {
  createEmptyUserProfile,
  loadCurrentUserProfile,
  saveCurrentUserProfile,
} from "@/modules/profile-management/profile-service"
import { validateUserProfile } from "@/modules/profile-management/validation"
import type { UserProfileData } from "@/modules/profile-management/types"

// =====================================================
// BLOCK: Profile Settings Form
// =====================================================

export function ProfileSettingsForm() {
  const [profile, setProfile] = useState<UserProfileData>(
    createEmptyUserProfile(),
  )

  const [message, setMessage] = useState("")
  const [saving, setSaving] = useState(false)

  // =====================================================
  // BLOCK: Load Local Profile
  // =====================================================

  useEffect(() => {
    async function loadProfile() {
      const currentProfile = await loadCurrentUserProfile()
      setProfile(currentProfile)
    }

    loadProfile()
  }, [])

  // =====================================================
  // BLOCK: Field Update Helper
  // =====================================================

  function updateField(field: keyof UserProfileData, value: string) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }))
  }

  // =====================================================
  // BLOCK: Save Handler
  // =====================================================

  async function handleSave() {
    setMessage("")

    const issues = validateUserProfile(profile)

    if (issues.length > 0) {
      setMessage(issues[0].message)
      return
    }

    setSaving(true)

    const result = await saveCurrentUserProfile(profile)

    setMessage(result.message)
    setSaving(false)
  }

  // =====================================================
  // BLOCK: Render
  // =====================================================

  return (
    <div className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-lg font-black text-slate-950">
          Personal Profile
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Keep your contact details and public career identity updated.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ProfileField
          label="Full Name"
          value={profile.fullName}
          onChange={(value) => updateField("fullName", value)}
          placeholder="Michael Rodriguez"
        />

        <ProfileField
          label="Email Address"
          value={profile.email}
          onChange={(value) => updateField("email", value)}
          placeholder="name@example.com"
        />

        <ProfileField
          label="Phone Number"
          value={profile.phone}
          onChange={(value) => updateField("phone", value)}
          placeholder="555-555-5555"
        />

        <ProfileField
          label="Location"
          value={profile.location}
          onChange={(value) => updateField("location", value)}
          placeholder="Decatur, IL"
        />

        <ProfileField
          label="LinkedIn"
          value={profile.linkedIn}
          onChange={(value) => updateField("linkedIn", value)}
          placeholder="https://linkedin.com/in/username"
        />

        <ProfileField
          label="Website"
          value={profile.website}
          onChange={(value) => updateField("website", value)}
          placeholder="https://yourwebsite.com"
        />
      </div>

      {message && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
          {message}
        </div>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-fit rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  )
}

// =====================================================
// BLOCK: Reusable Profile Field
// =====================================================

function ProfileField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />
    </label>
  )
}