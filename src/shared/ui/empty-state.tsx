import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

export function EmptyState({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('px-6 py-10 text-center text-sm text-muted-foreground', className)}>{children}</p>
}
