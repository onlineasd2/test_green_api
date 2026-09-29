import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/utils'
import { Button } from './primitives/button'
import { Spinner } from './spinner'

interface LoadingButtonProps extends ComponentProps<'button'> {
  loading?: boolean
  loadingText?: string
  fullWidth?: boolean
}

/** Основная кнопка действия с состоянием загрузки */
export function LoadingButton({
  loading = false,
  loadingText,
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      size="lg"
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn('h-10', fullWidth && 'w-full', className)}
      {...props}
    >
      {loading && <Spinner />}
      {loading && loadingText ? loadingText : children}
    </Button>
  )
}
