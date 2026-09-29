import { useActiveChatId, useChats, useChatStore } from '@/entities/chat'

/** Данные и действия списка чатов */
export function useChatList() {
  const chats = useChats()
  const activeChatId = useActiveChatId()
  const selectChat = useChatStore((state) => state.selectChat)

  return { chats, activeChatId, selectChat, isEmpty: chats.length === 0 }
}
