# Crestpoint Solutions V2 Architecture

Version: 1.10.0
Status: Active Development

---

## Product Direction

Crestpoint Solutions V2 is a modular Career Operating System for job seekers. The platform began with resume building and now expands into ATS optimization, job tracking, follow-up workflows, and career relationship management.

---

## Application Architecture

The app uses Next.js App Router with feature modules organized by business domain.

```txt
src/app/              Next.js pages and API routes
src/components/       Feature and shared UI components
src/modules/          Domain logic and client service boundaries
src/lib/              Shared infrastructure, config, Supabase, Stripe, access
src/types/            Shared TypeScript types
```

---

## Data Ownership

User-owned records are scoped through `user_id` and protected by Supabase Row Level Security.

Primary user-owned tables:

```txt
public.job_descriptions
public.job_applications
public.job_application_events
public.career_contacts
```

Every API route that reads or mutates user data must verify the authenticated user with `supabase.auth.getUser()` and scope queries by `user_id`.

---

## Career CRM Foundation

The v1.10.0 Career CRM module is implemented as a standalone foundation.

Module:

```txt
src/modules/career-crm/
```

API:

```txt
src/app/api/career-contacts/
```

UI:

```txt
src/components/crm/
src/app/dashboard/contacts/page.tsx
```

The CRM uses API-route-based client services. Client components do not write directly to Supabase for contact records; API routes own authentication, ownership checks, validation, and persistence.

---

## Integration Policy

Completed systems should remain stable unless explicit integration is required. Career CRM v1.10.0 does not modify Resume Builder, ATS, Job Tracker, Timeline, Follow-Up AI, Membership, or Usage Tracking behavior.
