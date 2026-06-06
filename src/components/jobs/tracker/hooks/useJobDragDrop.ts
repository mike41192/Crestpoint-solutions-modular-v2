"use client"

// =====================================================
// BLOCK: Imports
// Crestpoint Solutions V2
// Version: 1.9.4
// =====================================================

import { useState } from "react"
import type {
  JobApplicationRecord,
  JobApplicationStatus,
} from "@/modules/job-tracker"

// =====================================================
// BLOCK: Hook Types
// =====================================================

type UseJobDragDropProps = {
  onStatusChange: (payload: {
    applicationId: string
    nextStatus: JobApplicationStatus
  }) => Promise<void>
}

// =====================================================
// BLOCK: Drag And Drop Hook
// =====================================================

export function useJobDragDrop({ onStatusChange }: UseJobDragDropProps) {
  const [draggedApplication, setDraggedApplication] =
    useState<JobApplicationRecord | null>(null)

  const [dragOverStatus, setDragOverStatus] =
    useState<JobApplicationStatus | null>(null)

  // =====================================================
  // BLOCK: Drag Start
  // =====================================================

  function handleDragStart(application: JobApplicationRecord) {
    setDraggedApplication(application)
  }

  // =====================================================
  // BLOCK: Drag Over
  // =====================================================

  function handleDragOver(status: JobApplicationStatus) {
    setDragOverStatus(status)
  }

  // =====================================================
  // BLOCK: Drag Leave
  // =====================================================

  function handleDragLeave(status: JobApplicationStatus) {
    setDragOverStatus((currentStatus) =>
      currentStatus === status ? null : currentStatus,
    )
  }

  // =====================================================
  // BLOCK: Drop
  // =====================================================

  async function handleDrop(nextStatus: JobApplicationStatus) {
    if (!draggedApplication) {
      setDragOverStatus(null)
      return
    }

    if (draggedApplication.status !== nextStatus) {
      await onStatusChange({
        applicationId: draggedApplication.id,
        nextStatus,
      })
    }

    setDraggedApplication(null)
    setDragOverStatus(null)
  }

  // =====================================================
  // BLOCK: Drag End
  // =====================================================

  function handleDragEnd() {
    setDraggedApplication(null)
    setDragOverStatus(null)
  }

  return {
    draggedApplication,
    dragOverStatus,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  }
}
