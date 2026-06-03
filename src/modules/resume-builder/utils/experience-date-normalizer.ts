// =====================================================
// BLOCK: Experience Date Normalizer Types
// =====================================================

type ExperienceDateInput = {
  startDate?: string
  endDate?: string
}

export type NormalizedExperienceDates = {
  startDate: string
  endDate: string
}

// =====================================================
// BLOCK: Date Text Cleanup Helpers
// =====================================================

function cleanDateText(value?: string) {
  return (value || "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.-])/g, "$1")
    .trim()
}

// =====================================================
// BLOCK: Date Range Detection
// =====================================================

function splitDateRange(value: string) {
  const cleaned = cleanDateText(value)

  const separators = [
    " to ",
    " - ",
    " – ",
    " — ",
  ]

  for (const separator of separators) {
    if (cleaned.includes(separator)) {
      const [startDate, endDate] = cleaned
        .split(separator)
        .map((part) => cleanDateText(part))

      return {
        startDate: startDate || "",
        endDate: endDate || "",
      }
    }
  }

  return null
}

// =====================================================
// BLOCK: Public Date Normalizer
// =====================================================

export function normalizeExperienceDates(
  experience: ExperienceDateInput
): NormalizedExperienceDates {
  const startDate = cleanDateText(experience.startDate)
  const endDate = cleanDateText(experience.endDate)

  if (startDate && !endDate) {
    const splitDates = splitDateRange(startDate)

    if (splitDates) {
      return splitDates
    }
  }

  return {
    startDate,
    endDate,
  }
}

// =====================================================
// BLOCK: Public Experience Meta Builder
// =====================================================

export function buildExperienceMetaLine(
  experience: ExperienceDateInput & { location?: string }
) {
  const dates = normalizeExperienceDates(experience)

  return [
    cleanDateText(experience.location),
    dates.startDate,
    dates.endDate,
  ]
    .filter(Boolean)
    .join(" • ")
}
