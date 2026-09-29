import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

interface ListItemProps {
  title: ReactNode
  subtitle?: ReactNode
  /** Слева: аватар, иконка */
  leading?: ReactNode
  /** Справа от заголовка: время, метка */
  meta?: ReactNode
  /** Справа от подзаголовка: счётчик, статус */
  trailing?: ReactNode
  active?: boolean
  onClick?: () => void
}

/** Строка списка в стиле мессенджера: две строки текста + слоты по краям */
export function ListItem({ title, subtitle, leading, meta, trailing, active = false, onClick }: ListItemProps) {
  const secondary = active ? 'text-primary-foreground/80' : 'text-muted-foreground'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active || undefined}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors',
        active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
      )}
    >
      {leading}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-2">
          <span className="flex-1 truncate font-medium">{title}</span>
          {meta && <span className={cn('shrink-0 text-xs', secondary)}>{meta}</span>}
        </span>
        {(subtitle || trailing) && (
          <span className="flex items-center gap-2">
            <span className={cn('flex-1 truncate text-sm', secondary)}>{subtitle}</span>
            {trailing}
          </span>
        )}
      </span>
    </button>
  )
}
