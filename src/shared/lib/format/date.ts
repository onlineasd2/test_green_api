function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString()
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

/** Время для сегодняшних сообщений, иначе дата — как в списке чатов Telegram */
export function formatShortDate(timestamp: number, now = new Date()): string {
  const date = new Date(timestamp)
  if (isSameDay(date, now)) return formatTime(timestamp)
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

export function formatDayLabel(timestamp: number, now = new Date()): string {
  const date = new Date(timestamp)
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (isSameDay(date, now)) return 'Сегодня'
  if (isSameDay(date, yesterday)) return 'Вчера'
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  })
}
