# Crestpoint API Verification Matrix

Use this matrix during every API-related phase.

---

# Admin Diagnostic APIs

| Route | Purpose | Expected Result | Verified |
|---|---|---|---|
| /api/admin/app-status | App environment validation | JSON response | ⬜ |
| /api/admin/supabase-status | Supabase validation | JSON response | ⬜ |
| /api/admin/billing-status | Stripe validation | JSON response | ⬜ |
| /api/admin/ai-status | OpenAI validation | JSON response | ⬜ |
| /api/admin/vercel-status | Vercel validation | JSON response | ⬜ |
| /api/admin/github-status | GitHub validation | JSON response | ⬜ |
| /api/admin/system-status | Combined diagnostics | JSON response | ⬜ |

---

# Stripe APIs

| Route | Purpose | Expected Result | Verified |
|---|---|---|---|
| /api/stripe/checkout | Checkout scaffold | JSON response | ⬜ |
| /api/stripe/portal | Billing portal scaffold | JSON response | ⬜ |
| /api/stripe/webhook | Webhook scaffold | JSON response | ⬜ |

---

# Verification Rules

Before marking verified:

```txt
Route responds successfully
No 500 error
No TypeScript crash
Expected JSON appears
No exposed secrets
