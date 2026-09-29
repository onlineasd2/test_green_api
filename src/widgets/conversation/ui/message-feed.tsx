import { Fragment } from 'react'
import { DeliveryStatusIndicator, MessageBubble, type MessageFeedItem } from '@/entities/message'
import { ResendMessageButton } from '@/features/send-message'
import { useScrollToBottom } from '@/shared/lib/hooks'
import { OverlayPill, ScrollContainer } from '@/shared/ui'

interface MessageFeedProps {
  chatId: string
  feed: MessageFeedItem[]
}

/** Лента сообщений: разделители дней, пузыри, статус доставки или кнопка повтора */
export function MessageFeed({ chatId, feed }: MessageFeedProps) {
  const bottomRef = useScrollToBottom(feed.length)

  if (feed.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <OverlayPill>Сообщений пока нет — напишите первым</OverlayPill>
      </div>
    )
  }

  return (
    <ScrollContainer>
      <div role="log" aria-live="polite" className="mx-auto flex max-w-3xl flex-col px-3 py-3 md:px-6">
        {feed.map(({ message, dayLabel }) => (
          <Fragment key={message.id}>
            {dayLabel && (
              <OverlayPill sticky className="my-2">
                {dayLabel}
              </OverlayPill>
            )}
            <MessageBubble
              message={message}
              statusSlot={
                message.status === 'failed' ? (
                  <ResendMessageButton chatId={chatId} message={message} />
                ) : (
                  message.status && <DeliveryStatusIndicator status={message.status} />
                )
              }
            />
          </Fragment>
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollContainer>
  )
}
