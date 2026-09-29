import type { ReactNode } from 'react'
import { UiProvider } from '@/shared/ui'
import { QueryProvider } from './query-provider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <UiProvider>{children}</UiProvider>
    </QueryProvider>
  )
}
