// =====================================================
// BLOCK: Career CRM Types
// Crestpoint Solutions V2
// Version: 1.10.0
// =====================================================

export type CareerContactType =
  | "recruiter"
  | "hiring_manager"
  | "networking"
  | "coworker"
  | "mentor"
  | "other"

export type CareerRelationshipStatus =
  | "new"
  | "contacted"
  | "active"
  | "follow_up"
  | "closed"

export type CareerContactRecord = {
  id: string
  user_id: string
  name: string
  company: string | null
  role: string | null
  email: string | null
  phone: string | null
  linkedin_url: string | null
  contact_type: CareerContactType
  relationship_status: CareerRelationshipStatus
  notes: string | null
  last_contacted_at: string | null
  follow_up_at: string | null
  created_at: string
  updated_at: string
}

export type CareerContactPayload = {
  id?: string
  name: string
  company?: string
  role?: string
  email?: string
  phone?: string
  linkedinUrl?: string
  contactType?: CareerContactType
  relationshipStatus?: CareerRelationshipStatus
  notes?: string
  lastContactedAt?: string | null
  followUpAt?: string | null
}

export type CareerContactsResponse = {
  status: "success" | "error" | "unauthorized" | "not_found"
  message: string
  contact?: CareerContactRecord | null
  contacts?: CareerContactRecord[]
}

export type CareerContactOption<TValue extends string> = {
  value: TValue
  label: string
}
