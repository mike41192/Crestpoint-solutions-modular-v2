# Crestpoint Modular V2 Rollback Strategy

This document defines how stable checkpoints, backups, and rollback points should be handled during Crestpoint Modular V2 development.

## Backup Rule

Every successful phase must include:

```bash
npm run build
git add .
git commit -m "Phase X: description"
git push