import type { Message } from '@/entities/message/@x/chat'

export interface Chat {
  /** chatId в Telegram ("10000000") или номер в формате "79991234567@c.us" */
  chatId: string
  /** Номер телефона (только цифры), если чат создан по номеру */
  phone?: string
  /** Имя собеседника из уведомлений GREEN-API */
  title?: string
  messages: Message[]
  unread: number
  updatedAt: number
}

export interface ChatsState {
  chats: Chat[]
  activeChatId: string | null
}

export interface IncomingMessage {
  chatId: string
  message: Message
  phone?: string
  title?: string
  /** Эхо отправленного через API сообщения: пропускаем, если оно уже ждёт подтверждения */
  isApiEcho?: boolean
}
