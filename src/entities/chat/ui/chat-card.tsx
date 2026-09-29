import { formatShortDate } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import { CounterBadge, ListItem, UserAvatar } from '@/shared/ui'
import { getChatTitle, getLastMessagePreview } from '../lib/chat-display'
import type { Chat } from '../model/types'

interface ChatCardProps {
  chat: Chat
  active: boolean
  onSelect: (chatId: string) => void
}

/** Карточка чата в списке: аватар, имя, превью последнего сообщения, время, непрочитанные */
export function ChatCard({ chat, active, onSelect }: ChatCardProps) {
  const title = getChatTitle(chat)
  const preview = getLastMessagePreview(chat)

  return (
    <ListItem
      active={active}
      onClick={() => onSelect(chat.chatId)}
      leading={<UserAvatar name={title} seed={chat.chatId} size="lg" />}
      title={title}
      meta={chat.updatedAt && preview ? formatShortDate(chat.updatedAt) : undefined}
      subtitle={
        preview ? (
          <>
            {preview.isOwn && <span className={cn(!active && 'text-primary')}>Вы: </span>}
            {preview.text}
          </>
        ) : (
          'Нет сообщений'
        )
      }
      trailing={<CounterBadge count={chat.unread} inverted={active} />}
    />
  )
}
