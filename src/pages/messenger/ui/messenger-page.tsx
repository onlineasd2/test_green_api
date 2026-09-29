import { cn } from '@/shared/lib/utils'
import { ChatListPanel } from '@/widgets/chat-list-panel'
import { Conversation } from '@/widgets/conversation'
import { useMessengerPage } from '../model/use-messenger-page'

export function MessengerPage() {
  const { hasActiveChat } = useMessengerPage()

  // На мобильных список чатов и окно переписки — отдельные экраны
  return (
    <div className="flex h-dvh overflow-hidden">
      <ChatListPanel className={cn('w-full md:flex md:w-90 md:shrink-0', hasActiveChat ? 'hidden' : 'flex')} />
      <Conversation className={cn('md:flex', hasActiveChat ? 'flex' : 'hidden')} />
    </div>
  )
}
