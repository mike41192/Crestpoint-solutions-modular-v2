# Crestpoint Stable Module Registry

This registry tracks all stable module checkpoints and rollback-safe versions.

---

# Registry Rules

- Every successful module test should create a registry entry.
- Every stable phase should include:
  - Build verification
  - Git commit
  - Git push
  - Optional stable tag
- Major modules should include restore instructions.
- Deprecated/replaced files must be documented separately.

---

# Stable Modules

## Example Entry

### Module

```txt
AI Interviewer