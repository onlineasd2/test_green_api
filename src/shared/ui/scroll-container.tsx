import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import { ScrollArea } from './primitives/scroll-area'

interface ScrollContainerProps {
  children: ReactNode
  className?: string
}

/**
 * Вертикальный скролл с кастомным скроллбаром, растягивается на свободное место во flex-колонке.
 * Radix оборачивает контент в display: table, из-за чего не работает truncate — переопределяем на block.
 */
export function ScrollContainer({ children, className }: ScrollContainerProps) {
  return (
    <ScrollArea className={cn('min-h-0 flex-1 [&_[data-slot=scroll-area-viewport]>div]:block!', className)}>
      {children}
    </ScrollArea>
  )
}
