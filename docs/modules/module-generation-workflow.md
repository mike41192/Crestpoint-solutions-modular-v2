# Crestpoint Standard Module Generation Workflow

This document defines the exact process used to create future Crestpoint modules.

---

# Phase Workflow

Every module should now be built as a FULL MODULE PHASE instead of fragmented micro-phases.

---

# Required Module Structure

```txt
src/modules/[module-name]/
├── index.ts
├── config.ts
├── types.ts
├── schema.ts
├── service.ts
├── constants.ts
├── tutorial.ts
├── usage.ts
└── backup.ts