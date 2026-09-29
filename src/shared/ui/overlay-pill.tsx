import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import type { Icon } from './icons'

interface OverlayPillProps {
  children: ReactNode
  icon?: Icon
  /** Прилипает к верху прокручиваемого контейнера (разделители дат) */
  sticky?: boolean
  className?: string
}

/** Полупрозрачная плашка поверх фона чата: даты, подсказки, пустые состояния */
export function OverlayPill({ children, icon: IconComponent, sticky = false, className }: OverlayPillProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 self-center rounded-full bg-black/20 px-3 py-1 text-sm font-medium text-white',
        sticky && 'sticky top-2 z-10',
        className,
      )}
    >
      {IconComponent && <IconComponent className="size-4" aria-hidden />}
      {children}
    </div>
  )
}
