// =====================================================
// BLOCK: Job Tracker Exports
// Crestpoint Solutions V2
// Version: 1.9.0
// =====================================================

export type {
  JobApplicationPayload,
  JobApplicationPriority,
  JobApplicationRecord,
  JobApplicationStatus,
  JobTrackerColumnConfig,
  JobTrackerResponse,
} from "./types"

export {
  JOB_TRACKER_COLUMNS,
  createJobApplication,
  deleteJobApplication,
  listJobApplications,
  updateJobApplication,
  updateJobApplicationStatus,
} from "./job-tracker-service"
