# Resume Builder Verification Matrix

## Routes

/dashboard/resume
/dashboard/resume/export
/api/resume/optimize
/api/resume/save
/api/resume/load

## UI Verification

Resume page loads
Contact fields update
Summary field updates
Experience entries add/remove
Experience bullets add/remove
Education entries add/remove
Skills update
Certifications update
Live preview updates
Validation panel updates
Completion score updates
AI optimization button works
AI suggestions appear
AI suggestions apply
Local draft saves
Local draft loads after refresh
Local draft clears

## Export Verification

Export preview route loads
Resume layout renders
Print button opens browser print dialog
Browser save-as-PDF works

## API Verification

/api/resume/optimize returns JSON
/api/resume/save returns scaffold JSON
/api/resume/load returns scaffold JSON
No secrets exposed
No 500 errors

## Build Verification

npm run build

## Stable Tag

v2-resume-builder-foundation-complete

## Restore Command

git checkout v2-resume-builder-foundation-complete