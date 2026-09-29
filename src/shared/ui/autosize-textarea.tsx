import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/utils'
import { Textarea } from './primitives/textarea'

/** Многострочное поле, растущее по содержимому (field-sizing: content) до max-h */
export function AutosizeTextarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <Textarea
      rows={1}
      className={cn(
        'max-h-40 min-h-12 resize-none rounded-2xl border-none bg-background px-4 py-3 text-[15px] shadow-sm focus-visible:ring-2 md:text-[15px]',
        className,
      )}
      {...props}
    />
  )
}
