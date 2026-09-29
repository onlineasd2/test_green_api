import type { ReactNode } from 'react'
import { formatTime } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import type { Message } from '../model/types'

interface MessageBubbleProps {
  message: Message
  /** Слот для статуса доставки — виджет решает, что показать (индикатор или кнопку повтора) */
  statusSlot?: ReactNode
}

export function MessageBubble({ message, statusSlot }: MessageBubbleProps) {
  const isOutgoing = message.direction === 'outgoing'

  return (
    <div
      className={cn(
        'mt-1 flex max-w-[min(85%,560px)] flex-wrap items-end justify-end gap-x-2 rounded-2xl px-3 py-1.5 shadow-sm md:max-w-[min(70%,560px)]',
        isOutgoing ? 'self-end rounded-br-md bg-bubble-out' : 'self-start rounded-bl-md bg-bubble-in',
      )}
    >
      <p className="min-w-0 flex-auto text-[15px] leading-snug wrap-anywhere whitespace-pre-wrap">{message.text}</p>
      <span
        className={cn(
          'mb-[-2px] inline-flex items-center gap-0.5 text-xs whitespace-nowrap',
          isOutgoing ? 'text-bubble-out-meta' : 'text-muted-foreground',
        )}
      >
        <time dateTime={new Date(message.timestamp).toISOString()}>{formatTime(message.timestamp)}</time>
        {isOutgoing && statusSlot}
      </span>
    </div>
  )
}
