// =====================================================
// BLOCK: Action Verb Rules
// =====================================================

const ACTION_VERB_PATTERN =
  /^(managed|trained|performed|improved|maintained|investigated|supported|coordinated|implemented|reduced|developed|led|provided|operated|completed|diagnosed|responded|prepared|tracked|supervised)/i

// =====================================================
// BLOCK: Bullet Detection
// =====================================================

export function isBulletLine(line: string) {
  return (
    line.startsWith("•") ||
    line.startsWith("-") ||
    ACTION_VERB_PATTERN.test(line)
  )
}

export function shouldMergeBullet(line: string) {
  return (
    !ACTION_VERB_PATTERN.test(line) &&
    line.length < 100
  )
}