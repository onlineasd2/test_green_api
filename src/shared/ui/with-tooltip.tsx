import type { ReactElement, ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './primitives/tooltip'

interface WithTooltipProps {
  content: ReactNode
  /** Один элемент, умеющий принимать ref (кнопка, span и т.п.) */
  children: ReactElement
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function WithTooltip({ content, children, side }: WithTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{content}</TooltipContent>
    </Tooltip>
  )
}
