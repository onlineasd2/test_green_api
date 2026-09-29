import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import { AlertIcon } from './icons'
import { Alert, AlertDescription, AlertTitle } from './primitives/alert'

interface ErrorAlertProps {
  title?: string
  children: ReactNode
  className?: string
}

export function ErrorAlert({ title, children, className }: ErrorAlertProps) {
  return (
    <Alert variant="destructive" className={cn('w-auto', className)}>
      <AlertIcon />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}
