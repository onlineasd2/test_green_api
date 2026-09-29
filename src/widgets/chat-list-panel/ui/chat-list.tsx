import { ChatCard } from '@/entities/chat'
import { EmptyState, ScrollContainer } from '@/shared/ui'
import { useChatList } from '../model/use-chat-list'

export function ChatList() {
  const { chats, activeChatId, selectChat, isEmpty } = useChatList()

  if (isEmpty) return <EmptyState>Чатов пока нет. Введите номер телефона, чтобы начать переписку.</EmptyState>

  return (
    <ScrollContainer>
      <nav aria-label="Список чатов" className="flex flex-col gap-0.5 px-2 pb-2">
        {chats.map((chat) => (
          <ChatCard key={chat.chatId} chat={chat} active={chat.chatId === activeChatId} onSelect={selectChat} />
        ))}
      </nav>
    </ScrollContainer>
  )
}
