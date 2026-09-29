import type { IncomingMessage } from '@/entities/chat'
import type { DeliveryStatus } from '@/entities/message'
import { extractText, type NotificationBody } from '@/shared/api'

export type ParsedNotification =
  | { type: 'message'; message: IncomingMessage }
  | { type: 'status'; id: string; status: DeliveryStatus }

const WEBHOOK_STATUSES: Record<string, DeliveryStatus> = {
  sent: 'sent',
  delivered: 'delivered',
  read: 'read',
  failed: 'failed',
  noAccount: 'failed',
  notInGroup: 'failed',
}

/**
 * Переводит уведомление GREEN-API в событие чата.
 * null — уведомление нам не интересно (нетекстовое сообщение, смена состояния инстанса и т.п.).
 */
export function parseNotification(body: NotificationBody): ParsedNotification | null {
  switch (body.typeWebhook) {
    case 'incomingMessageReceived':
    case 'outgoingMessageReceived':
    case 'outgoingAPIMessageReceived': {
      const text = extractText(body.messageData)
      const sender = body.senderData
      if (text === null || !sender || !body.idMessage) return null

      const isIncoming = body.typeWebhook === 'incomingMessageReceived'
      const isPersonal = !sender.chatId.startsWith('-')
      return {
        type: 'message',
        message: {
          chatId: sender.chatId,
          // В личном входящем senderPhoneNumber — номер собеседника: по нему находим чат, созданный по номеру
          phone: isIncoming && isPersonal && sender.senderPhoneNumber ? String(sender.senderPhoneNumber) : undefined,
          title: isIncoming && isPersonal ? sender.senderContactName || sender.senderName || sender.chatName : sender.chatName,
          isApiEcho: body.typeWebhook === 'outgoingAPIMessageReceived',
          message: {
            id: body.idMessage,
            text,
            timestamp: body.timestamp * 1000,
            direction: isIncoming ? 'incoming' : 'outgoing',
            status: isIncoming ? undefined : 'sent',
          },
        },
      }
    }
    case 'outgoingMessageStatus': {
      const status = body.status ? WEBHOOK_STATUSES[body.status] : undefined
      return body.idMessage && status ? { type: 'status', id: body.idMessage, status } : null
    }
    default:
      return null
  }
}
