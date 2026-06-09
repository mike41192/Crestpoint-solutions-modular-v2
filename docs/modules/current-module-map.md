# Crestpoint Modular V2 Current Module Map

Version: 1.10.0
Checkpoint: stable-v1.9.9-ai-followup-assistant
Status: Active Development

---

## Core Career Operating System Modules

```txt
src/modules/resume-builder/
src/modules/ats-engine/
src/modules/ats-explainability/
src/modules/ats-intelligence/
src/modules/gap-analyzer/
src/modules/job-description-library/
src/modules/job-tracker/
src/modules/job-application-events/
src/modules/job-followup-ai/
src/modules/career-crm/
src/modules/membership-management/
src/modules/usage-tracking/
```

---

## v1.10.0 Career CRM Foundation

Module path:

```txt
src/modules/career-crm/
├── index.ts
├── types.ts
└── career-contact-service.ts
```

UI path:

```txt
src/components/crm/
├── CareerContactsDashboard.tsx
├── CareerContactForm.tsx
├── CareerContactCard.tsx
└── CareerContactDetailDrawer.tsx
```

API routes:

```txt
src/app/api/career-contacts/create/route.ts
src/app/api/career-contacts/update/route.ts
src/app/api/career-contacts/delete/route.ts
src/app/api/career-contacts/list/route.ts
```

Dashboard route:

```txt
src/app/dashboard/contacts/page.tsx
```

Database table:

```txt
public.career_contacts
```

Ownership model:

```txt
career_contacts.user_id -> auth.users.id
RLS policy: auth.uid() = user_id
```

Purpose:

Career CRM stores recruiters, hiring managers, networking contacts, mentors, coworkers, and other career relationships. It is standalone in v1.10.0 and is designed for future integration with applications, reminders, outreach campaigns, and AI relationship management.
