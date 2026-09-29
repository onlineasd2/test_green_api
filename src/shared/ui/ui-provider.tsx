import type { ReactNode } from 'react'
import { Toaster } from './primitives/sonner'
import { TooltipProvider } from './primitives/tooltip'

/** Глобальный контекст UI-кита: подсказки и тосты */
export function UiProvider({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider delayDuration={300}>
      {children}
      <Toaster theme="light" position="top-center" richColors />
    </TooltipProvider>
  )
}
