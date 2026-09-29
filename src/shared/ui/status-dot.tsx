import { cn } from '@/shared/lib/utils'

const TONES = {
  neutral: 'bg-muted-foreground',
  success: 'bg-online',
  danger: 'bg-destructive',
} as const

export type StatusTone = keyof typeof TONES

export function StatusDot({ tone = 'neutral', className }: { tone?: StatusTone; className?: string }) {
  return <span className={cn('inline-block size-2 shrink-0 rounded-full', TONES[tone], className)} aria-hidden />
}
