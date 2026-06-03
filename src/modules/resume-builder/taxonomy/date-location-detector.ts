// =====================================================
// BLOCK: Date Rules
// =====================================================

export const DATE_RANGE_PATTERN =
  /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|20\d{2}).*(present|20\d{2})/i

export const LOCATION_PATTERN =
  /[A-Za-z\s]+,\s?[A-Z]{2}/

// =====================================================
// BLOCK: Detection Helpers
// =====================================================

export function looksLikeDateRange(value: string) {
  return DATE_RANGE_PATTERN.test(value)
}

export function looksLikeLocation(value: string) {
  return LOCATION_PATTERN.test(value)
}