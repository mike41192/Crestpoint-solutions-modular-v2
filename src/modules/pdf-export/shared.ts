export const PAGE_BOTTOM_MARGIN = 720
export const PAGE_TOP_AFTER_BREAK = 60

export function ensurePageSpace(
  doc: any,
  requiredHeight = 80
) {
  if (doc.y + requiredHeight > PAGE_BOTTOM_MARGIN) {
    doc.addPage()
    doc.y = PAGE_TOP_AFTER_BREAK
  }
}

export function estimateBulletHeight(text: string) {
  const length = text?.length || 0

  if (length < 80) return 20
  if (length < 160) return 35
  if (length < 240) return 50

  return 70
}

export function estimateParagraphHeight(text: string) {
  const length = text?.length || 0

  if (length < 200) return 40
  if (length < 400) return 70
  if (length < 700) return 120

  return 160
}
