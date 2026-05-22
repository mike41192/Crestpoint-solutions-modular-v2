# Crestpoint Route Verification Matrix

Use this matrix during every major build phase.

---

# Dashboard Routes

| Route | Purpose | Verified |
|---|---|---|
| /dashboard | Main dashboard | ⬜ |
| /dashboard/resume | Resume builder | ⬜ |
| /dashboard/ats | ATS scoring | ⬜ |
| /dashboard/interview | AI interviewer | ⬜ |
| /dashboard/interview-academy | Interview academy | ⬜ |
| /dashboard/linkedin | LinkedIn optimizer | ⬜ |
| /dashboard/jobs | Job tracker | ⬜ |
| /dashboard/networking | Networking outreach | ⬜ |
| /dashboard/analytics | Analytics dashboard | ⬜ |
| /dashboard/settings | User settings | ⬜ |
| /dashboard/billing | Billing dashboard | ⬜ |

---

# Admin Routes

| Route | Purpose | Verified |
|---|---|---|
| /admin/settings | Settings hub | ⬜ |
| /admin/settings/modules | Module access | ⬜ |
| /admin/settings/tiers | Membership tiers | ⬜ |
| /admin/settings/access-test | Access verification | ⬜ |
| /admin/settings/pricing | Pricing | ⬜ |
| /admin/settings/billing-status | Stripe diagnostics | ⬜ |
| /admin/settings/supabase-status | Supabase diagnostics | ⬜ |
| /admin/settings/app-status | App diagnostics | ⬜ |
| /admin/settings/vercel-status | Vercel diagnostics | ⬜ |
| /admin/settings/github-status | GitHub diagnostics | ⬜ |
| /admin/settings/system-status | Combined diagnostics | ⬜ |
| /admin/settings/backup-status | Backup rules | ⬜ |
| /admin/settings/module-registry | Stable registry | ⬜ |
| /admin/settings/deprecated-files | Deprecated tracking | ⬜ |
| /admin/settings/cleanup-checklist | Cleanup rules | ⬜ |
| /admin/settings/usage | Usage limits | ⬜ |
| /admin/settings/ai-quality | AI quality | ⬜ |
| /admin/settings/ai-status | OpenAI diagnostics | ⬜ |

---

# API Routes

| Route | Purpose | Verified |
|---|---|---|
| /api/admin/app-status | App env check | ⬜ |
| /api/admin/supabase-status | Supabase env check | ⬜ |
| /api/admin/billing-status | Stripe env check | ⬜ |
| /api/admin/ai-status | OpenAI env check | ⬜ |
| /api/admin/vercel-status | Vercel env check | ⬜ |
| /api/admin/github-status | GitHub env check | ⬜ |
| /api/admin/system-status | Combined diagnostics | ⬜ |

---

# Verification Rules

Before marking verified:

```txt
Route loads successfully
No crash
No TypeScript error
No console error
Expected UI appears
Expected JSON appears for API routes