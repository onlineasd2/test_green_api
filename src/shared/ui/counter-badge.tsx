import { cn } from '@/shared/lib/utils'
import { Badge } from './primitives/badge'

interface CounterBadgeProps {
  count: number
  /** Инвертированные цвета — для выделенного элемента списка */
  inverted?: boolean
  max?: number
}

/** Счётчик (например, непрочитанных); при count ≤ 0 не рендерится */
export function CounterBadge({ count, inverted = false, max = 99 }: CounterBadgeProps) {
  if (count <= 0) return null
  return (
    <Badge className={cn('h-5 min-w-5 rounded-full px-1.5', inverted && 'bg-primary-foreground text-primary')}>
      {count > max ? `${max}+` : count}
    </Badge>
  )
}
