# Crestpoint Technical Debt Register

## TD-001 — Resume Import Parser

Status: Improving

Issue:
Legacy parser logic became difficult to maintain.

Resolution:
Taxonomy-based parser introduced.

Next:
Add parser diagnostics and test fixtures.

---

## TD-002 — Logout Missing

Status: Open

Issue:
Logout is not currently implemented.

Risk:
Users may remain signed in on shared devices.

Priority:
High before production launch.

---

## TD-003 — Scaffold Routes

Status: Open

Affected:

- Stripe checkout
- Stripe portal
- Stripe webhook
- Analytics
- User usage
- Resume feedback

Priority:
Medium to High depending on release target.

---

## TD-004 — ResumeStarterForm Size

Status: Open

Issue:
ResumeStarterForm is becoming large.

Recommendation:
Refactor into smaller hooks and workspace components.
