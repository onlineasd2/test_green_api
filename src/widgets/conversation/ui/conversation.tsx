import { ChatPeerInfo } from '@/entities/chat'
import { MessageComposer } from '@/features/send-message'
import { cn } from '@/shared/lib/utils'
import { BackIcon, ChatIcon, IconButton, OverlayPill } from '@/shared/ui'
import { useConversation } from '../model/use-conversation'
import { MessageFeed } from './message-feed'

/** Окно переписки: шапка с собеседником, лента сообщений, поле ввода */
export function Conversation({ className }: { className?: string }) {
  const { chat, feed, close } = useConversation()

  if (!chat) {
    return (
      <section className={cn('flex-1 items-center justify-center bg-chat', className)}>
        <OverlayPill icon={ChatIcon}>Выберите чат или создайте новый по номеру телефона</OverlayPill>
      </section>
    )
  }

  return (
    <section className={cn('min-w-0 flex-1 flex-col bg-chat', className)}>
      <header className="flex items-center gap-3 border-b bg-background px-3 py-2 md:px-4">
        <IconButton icon={BackIcon} label="Назад к чатам" onClick={close} showTooltip={false} className="md:hidden" />
        <ChatPeerInfo chat={chat} />
      </header>

      <MessageFeed chatId={chat.chatId} feed={feed} />
      {/* key сбрасывает черновик при переключении чата */}
      <MessageComposer key={chat.chatId} chatId={chat.chatId} />
    </section>
  )
}
