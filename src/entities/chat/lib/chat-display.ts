import { formatPhone } from '@/shared/lib/format'
import type { Chat } from '../model/types'

export function getChatTitle(chat: Chat): string {
  return chat.title || (chat.phone ? formatPhone(chat.phone) : chat.chatId)
}

export function getChatSubtitle(chat: Chat): string {
  return chat.title && chat.phone ? formatPhone(chat.phone) : 'Telegram'
}

export function getLastMessagePreview(chat: Chat): { text: string; isOwn: boolean } | null {
  const last = chat.messages.at(-1)
  return last ? { text: last.text, isOwn: last.direction === 'outgoing' } : null
}
