import { getInitials } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import { Avatar, AvatarFallback } from './primitives/avatar'

// Палитра аватаров как в Telegram
const GRADIENTS = [
  'from-[#ff885e] to-[#ff516a]',
  'from-[#ffcd6a] to-[#ffa85c]',
  'from-[#82b1ff] to-[#665fff]',
  'from-[#a0de7e] to-[#54cb68]',
  'from-[#53edd6] to-[#28c9b7]',
  'from-[#72d5fd] to-[#2a9ef1]',
  'from-[#e0a2f3] to-[#d669ed]',
]

const SIZES = {
  sm: 'size-10 text-sm',
  md: 'size-12 text-base',
  lg: 'size-13 text-base',
} as const

function gradientFor(seed: string): string {
  let hash = 0
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return GRADIENTS[hash % GRADIENTS.length]
}

interface UserAvatarProps {
  name: string
  /** Стабильный ключ для выбора цвета (id пользователя) */
  seed?: string
  size?: keyof typeof SIZES
  className?: string
}

/** Аватар с инициалами на цветном градиенте */
export function UserAvatar({ name, seed = name, size = 'md', className }: UserAvatarProps) {
  return (
    <Avatar className={cn('after:hidden', SIZES[size], className)} aria-hidden>
      <AvatarFallback className={cn('bg-linear-to-b font-medium text-white', gradientFor(seed))}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
