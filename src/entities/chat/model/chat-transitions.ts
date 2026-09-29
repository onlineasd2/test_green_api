import { isStatusUpgrade, type DeliveryStatus } from '@/entities/message/@x/chat'
import type { Chat, ChatsState, IncomingMessage } from './types'

/**
 * Чистые функции переходов состояния чатов.
 * Стор (chat-store.ts) только вызывает их — логику легко покрыть тестами.
 */

function findChatIndex(chats: Chat[], chatId: string, phone?: string): number {
  return chats.findIndex((chat) => chat.chatId === chatId || (phone !== undefined && chat.phone === phone))
}

function patchChat(chats: Chat[], index: number, patch: (chat: Chat) => Chat): Chat[] {
  return chats.map((chat, i) => (i === index ? patch(chat) : chat))
}

function patchChatWithMessage(chats: Chat[], messageId: string, patch: (chat: Chat) => Chat): Chat[] {
  const index = chats.findIndex((chat) => chat.messages.some((m) => m.id === messageId))
  return index < 0 ? chats : patchChat(chats, index, patch)
}

export function openChat(state: ChatsState, chatId: string, phone?: string): ChatsState {
  const index = findChatIndex(state.chats, chatId, phone)
  if (index >= 0) {
    return {
      chats: patchChat(state.chats, index, (chat) => ({ ...chat, unread: 0 })),
      activeChatId: state.chats[index].chatId,
    }
  }
  const chat: Chat = { chatId, phone, messages: [], unread: 0, updatedAt: Date.now() }
  return { chats: [chat, ...state.chats], activeChatId: chatId }
}

export function selectChat(state: ChatsState, chatId: string | null): ChatsState {
  const index = chatId === null ? -1 : findChatIndex(state.chats, chatId)
  return {
    chats: index < 0 ? state.chats : patchChat(state.chats, index, (chat) => ({ ...chat, unread: 0 })),
    activeChatId: chatId,
  }
}

export function addMessage(state: ChatsState, input: IncomingMessage): ChatsState {
  const { message } = input
  const index = findChatIndex(state.chats, input.chatId, input.phone)
  const existing = index >= 0 ? state.chats[index] : undefined

  if (existing?.messages.some((m) => m.id === message.id)) return state
  if (
    input.isApiEcho &&
    existing?.messages.some((m) => m.status === 'pending' && m.direction === 'outgoing' && m.text === message.text)
  ) {
    return state
  }

  const base: Chat = existing ?? {
    chatId: input.chatId,
    phone: input.phone,
    messages: [],
    unread: 0,
    updatedAt: message.timestamp,
  }
  const isActive = state.activeChatId !== null && state.activeChatId === base.chatId
  // Чат мог быть создан по номеру "7999...@c.us" — заменяем на настоящий chatId из уведомления
  const chatId = existing && !input.chatId.includes('@') ? input.chatId : base.chatId

  const chat: Chat = {
    ...base,
    chatId,
    phone: base.phone ?? input.phone,
    title: input.title || base.title,
    messages: [...base.messages, message].sort((a, b) => a.timestamp - b.timestamp),
    unread: message.direction === 'incoming' && !isActive ? base.unread + 1 : base.unread,
    updatedAt: Math.max(base.updatedAt, message.timestamp),
  }

  return {
    chats: [chat, ...state.chats.filter((_, i) => i !== index)],
    activeChatId: isActive ? chat.chatId : state.activeChatId,
  }
}

/** Заменяет временный id на idMessage из ответа SendMessage */
export function confirmMessage(state: ChatsState, localId: string, id: string): ChatsState {
  return {
    ...state,
    chats: patchChatWithMessage(state.chats, localId, (chat) => {
      // Уведомление outgoingAPIMessageReceived могло прийти раньше ответа sendMessage
      const alreadyReceived = chat.messages.some((m) => m.id === id)
      const messages = alreadyReceived
        ? chat.messages.filter((m) => m.id !== localId)
        : chat.messages.map((m) => (m.id === localId ? { ...m, id, status: 'sent' as const } : m))
      return { ...chat, messages }
    }),
  }
}

/** Статусы только «растут»: запоздавший delivered не перезапишет read */
export function setMessageStatus(state: ChatsState, id: string, status: DeliveryStatus): ChatsState {
  return {
    ...state,
    chats: patchChatWithMessage(state.chats, id, (chat) => ({
      ...chat,
      messages: chat.messages.map((m) =>
        m.id === id && isStatusUpgrade(m.status, status) ? { ...m, status } : m,
      ),
    })),
  }
}

export function removeMessage(state: ChatsState, id: string): ChatsState {
  return {
    ...state,
    chats: patchChatWithMessage(state.chats, id, (chat) => ({
      ...chat,
      messages: chat.messages.filter((m) => m.id !== id),
    })),
  }
}

/** После перезагрузки страницы незавершённые отправки считаем неудачными */
export function failPendingMessages(chats: Chat[]): Chat[] {
  return chats.map((chat) => ({
    ...chat,
    messages: chat.messages.map((m) => (m.status === 'pending' ? { ...m, status: 'failed' as const } : m)),
  }))
}
