import { formatDayLabel } from '@/shared/lib/format'
import type { Message } from '../model/types'

export interface MessageFeedItem {
  message: Message
  /** Подпись дня, если с этого сообщения начинается новый день */
  dayLabel?: string
}

export function groupByDay(messages: Message[], now = new Date()): MessageFeedItem[] {
  let previousDay: string | undefined
  return messages.map((message) => {
    const day = formatDayLabel(message.timestamp, now)
    const item = { message, dayLabel: day === previousDay ? undefined : day }
    previousDay = day
    return item
  })
}
