# Crestpoint Modular V2 Module Standard

Every module must include:

- Route
- Config
- Types
- Schema
- Service
- Constants
- Tutorial support
- Usage limits
- Access gating
- Backup manifest
- Stable registry entry
- Deprecated file review

## Standard Module Folder

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