import { greenApiRequest } from './client'
import type {
  CheckAccountResponse,
  Credentials,
  DeleteNotificationResponse,
  GetStateInstanceResponse,
  MessageData,
  Notification,
  SendMessageResponse,
} from './types'

/** Хост API по умолчанию: первые 4 цифры idInstance — номер кластера (4100 → 4100.api.green-api.com) */
export function defaultApiUrl(idInstance: string): string {
  const id = idInstance.trim()
  return /^\d{4,}$/.test(id) ? `https://${id.slice(0, 4)}.api.green-api.com` : 'https://api.green-api.com'
}

export function getStateInstance(credentials: Credentials, signal?: AbortSignal) {
  return greenApiRequest<GetStateInstanceResponse>(credentials, 'getStateInstance', { signal })
}

export function checkAccount(credentials: Credentials, phoneNumber: string) {
  return greenApiRequest<CheckAccountResponse>(credentials, 'checkAccount', {
    httpMethod: 'POST',
    body: { phoneNumber: Number(phoneNumber) },
  })
}

/** https://green-api.com/telegram/docs/api/sending/SendMessage/ */
export function sendMessage(credentials: Credentials, chatId: string, message: string) {
  return greenApiRequest<SendMessageResponse>(credentials, 'sendMessage', {
    httpMethod: 'POST',
    body: { chatId, message },
  })
}

/**
 * Long polling: сервер держит запрос до receiveTimeout секунд (5–60) и возвращает null, если очередь пуста.
 * https://green-api.com/telegram/docs/api/receiving/technology-http-api/ReceiveNotification/
 */
export function receiveNotification(credentials: Credentials, signal: AbortSignal, receiveTimeout = 20) {
  return greenApiRequest<Notification | null>(credentials, 'receiveNotification', {
    query: { receiveTimeout },
    signal,
  })
}

export function deleteNotification(credentials: Credentials, receiptId: number, signal?: AbortSignal) {
  return greenApiRequest<DeleteNotificationResponse>(credentials, 'deleteNotification', {
    httpMethod: 'DELETE',
    path: String(receiptId),
    signal,
  })
}

/** Текст сообщения из уведомления; null — для нетекстовых сообщений */
export function extractText(messageData?: MessageData): string | null {
  if (!messageData) return null
  return messageData.textMessageData?.textMessage ?? messageData.extendedTextMessageData?.text ?? null
}
