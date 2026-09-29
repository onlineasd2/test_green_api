import { useChatStore } from './chat-store'
import type { Chat } from './types'

// Хуки-селекторы: компоненты подписываются только на нужный срез стора

export function useChats(): Chat[] {
  return useChatStore((state) => state.chats)
}

export function useActiveChatId(): string | null {
  return useChatStore((state) => state.activeChatId)
}

export function useActiveChat(): Chat | undefined {
  return useChatStore((state) => state.chats.find((chat) => chat.chatId === state.activeChatId))
}

export function useHasActiveChat(): boolean {
  return useChatStore((state) => state.activeChatId !== null)
}
