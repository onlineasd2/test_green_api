import { useMemo } from 'react'
import { useActiveChat, useChatStore } from '@/entities/chat'
import { groupByDay } from '@/entities/message'

/** Открытый чат, лента сообщений с разделителями дней и закрытие чата */
export function useConversation() {
  const chat = useActiveChat()
  const selectChat = useChatStore((state) => state.selectChat)
  const feed = useMemo(() => groupByDay(chat?.messages ?? []), [chat?.messages])

  return { chat, feed, close: () => selectChat(null) }
}
