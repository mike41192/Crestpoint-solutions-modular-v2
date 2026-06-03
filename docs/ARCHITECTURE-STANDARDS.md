# Crestpoint Architecture Standards

## Taxonomy-First Rule

If a system classifies, scores, parses, matches, recommends, gates, or evaluates, use a modular taxonomy/rules layer whenever practical.

Avoid embedding business intelligence directly inside large parser files, UI components, or API routes.

## Required Standards

- Modular architecture
- Centralized configuration
- Versioned engines
- Diagnostic output where useful
- Feature flags for major engine changes
- Test fixtures for parser/scoring systems
- Module README files
- Technical debt tracking
- Rollback-safe releases

## Engine Versioning

Major engines must expose a version string.

Examples:

- resume_import_taxonomy_v1
- ats_gap_analyzer_v1
- achievement_intelligence_v1

## Diagnostics

Parser/scoring systems should be able to explain:

- input
- classification
- confidence
- reason
- engine version

## Feature Flags

Major behavior changes should be controlled by feature flags when practical.

## Future Admin Training

Taxonomies should eventually support admin-managed terms stored in Supabase.