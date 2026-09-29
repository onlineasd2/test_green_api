import { chatActions } from '@/entities/chat'
import type { NotificationBody } from '@/shared/api'
import { parseNotification } from './parse-notification'

/** Применяет уведомление GREEN-API к стору чатов */
export function applyNotification(body: NotificationBody): void {
  const event = parseNotification(body)
  if (event?.type === 'message') chatActions().addMessage(event.message)
  if (event?.type === 'status') chatActions().setMessageStatus(event.id, event.status)
}
