import { UserAvatar } from '@/shared/ui'
import { getChatSubtitle, getChatTitle } from '../lib/chat-display'
import type { Chat } from '../model/types'

/** Собеседник в шапке чата: аватар, имя и номер */
export function ChatPeerInfo({ chat }: { chat: Chat }) {
  const title = getChatTitle(chat)

  return (
    <div className="flex min-w-0 items-center gap-3">
      <UserAvatar name={title} seed={chat.chatId} size="sm" />
      <div className="min-w-0">
        <h2 className="truncate font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{getChatSubtitle(chat)}</p>
      </div>
    </div>
  )
}
