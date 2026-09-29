export function getInitials(title: string): string {
  const words = title.replace(/[^\p{L}\p{N}\s]/gu, '').trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '#'
  if (/^\d/.test(words[0])) return words.join('').slice(-2)
  return words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}
