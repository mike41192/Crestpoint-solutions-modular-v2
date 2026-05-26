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

  v2-admin-tools-stable
  v2-ai-interviewer-stable
  v2-ai-resume-parser-stable
  v2-anaylytics-dashboard-stable
  v2-ats-scoring-stable
  v2-billing-manager-stable
  v2-career-coach-stable
  v2-cover-letter-stable
  v2-interview-academy-stable
  v2-job-match-engine-stable
  v2-job-tracker-stable
  v2-linkedin-optimizer-stable
  v2-networking-outreach-stable
  v2-phase-83-module-standarization
  v2-phase-84-module-map
  v2-phase-86-module-workflow
  v2-phase-91-completed-workflow-verification
  v2-portfolio-builder-stable
  v2-resume-builder-stable
  v2-salary-inteligence-stable
  v2-seo-blog-stable


## Stable scaffold points

v2-scaffold-stable
v2-stable-scaffold-phase-103

## Module

## Resume Builder Foundation
  v2-resume-builder-foundation

   File route

  /dashboard/resume

  Included files 

  src/app/dashboard/resume/page.tsx
  src/modules/resume-builder/index.ts
  src/modules/resume-builder/config.ts
  src/modules/resume-builder/types.ts
  src/modules/resume-builder/schema.ts
  src/modules/resume-builder/service.ts
  src/modules/resume-builder/constants.ts
  src/modules/resume-builder/tutorial.ts
  src/modules/resume-builder/usage.ts
  src/modules/resume-builder/backup.ts

  Restoration command

  git checkout v2-resume-builder-foundation

## Resume Builder Form Consolidation

  Stable Version

  txt
  resume-builder-form-consolidated

  Stable Tag

  v2-resume-builder-form-consolidated

  Files Included

  src/components/resume/ResumeStarterForm.tsx
  src/components/resume/form-sections/ContactSection.tsx
  src/components/resume/form-sections/SummarySection.tsx
  src/components/resume/form-sections/ExperienceSection.tsx
  src/components/resume/form-sections/EducationSection.tsx
  src/components/resume/form-sections/SkillsCertificationsSection.tsx
  src/components/resume/form-sections/sharedStyles.ts

  Restore command

  git checkout v2-resume-builder-form-consolidated

## Resume Builder Local Draft System

   Stable Version

  txt
  resume-builder-local-draft-v1

  Stable Tag 

  v2-resume-builder-local-draft

  Route

  /dashboard/resume

  Files included

  src/app/dashboard/resume/page.tsx
  src/components/resume/ResumeStarterForm.tsx
  src/components/resume/ResumeEditorPreview.tsx
  src/components/resume/form-sections/ContactSection.tsx
  src/components/resume/form-sections/SummarySection.tsx
  src/components/resume/form-sections/ExperienceSection.tsx
  src/components/resume/form-sections/EducationSection.tsx
  src/components/resume/form-sections/SkillsCertificationsSection.tsx
  src/components/resume/form-sections/sharedStyles.ts
  src/modules/resume-builder/service.ts
  src/modules/resume-builder/types.ts

  Verified features

  Contact fields
  Summary field
  Experience entries
  Multiple bullets
  Education entries
  Skills
  Certifications
  Live preview
  Local browser draft save
  Local draft reload
  Local draft clear
  Safe localStorage service guard

  Restore command

  git checkout v2-resume-builder-local-draft
  
## Resume Builder Export + Print View System

### Stable Version

.txt
resume-builder-export-print-v1

Stable Tag

v2-resume-builder-export-print

Routes

/dashboard/resume
/dashboard/resume/export

Files included

src/app/dashboard/resume/page.tsx
src/app/dashboard/resume/export/page.tsx
src/components/resume/ResumeExportPreview.tsx
src/components/resume/ResumePrintActions.tsx
src/components/resume/ResumeStarterForm.tsx
src/modules/resume-builder/

Verified features

Resume dashboard export link
Print-friendly export preview route
Browser print action
Save-as-PDF browser workflow
Resume export layout sections

Restore command

git checkout v2-resume-builder-export-print
