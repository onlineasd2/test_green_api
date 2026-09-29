import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/utils'
import type { Icon } from './icons'
import { Button } from './primitives/button'
import { Spinner } from './spinner'
import { WithTooltip } from './with-tooltip'

const SIZES = {
  md: 'size-9 [&_svg]:size-5',
  lg: 'size-10 [&_svg]:size-5',
  xl: 'size-12 [&_svg]:size-5',
} as const

interface IconButtonProps extends Omit<ComponentProps<'button'>, 'children'> {
  icon: Icon
  /** Обязательная подпись: используется как aria-label и текст подсказки */
  label: string
  variant?: 'ghost' | 'primary'
  size?: keyof typeof SIZES
  loading?: boolean
  showTooltip?: boolean
}

/** Круглая кнопка-иконка с доступной подписью и подсказкой */
export function IconButton({
  icon: IconComponent,
  label,
  variant = 'ghost',
  size = 'lg',
  loading = false,
  showTooltip = true,
  disabled,
  className,
  ...props
}: IconButtonProps) {
  const button = (
    <Button
      type="button"
      variant={variant === 'primary' ? 'default' : 'ghost'}
      aria-label={label}
      disabled={disabled || loading}
      className={cn('shrink-0 rounded-full p-0', SIZES[size], className)}
      {...props}
    >
      {loading ? <Spinner /> : <IconComponent />}
    </Button>
  )

  return showTooltip ? <WithTooltip content={label}>{button}</WithTooltip> : button
}
