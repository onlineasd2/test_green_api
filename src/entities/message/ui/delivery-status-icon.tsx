import { AlertIcon, CheckIcon, ClockIcon, DoubleCheckIcon, WithTooltip } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { DELIVERY_STATUS_LABELS } from '../lib/delivery-status'
import type { DeliveryStatus } from '../model/types'

const ICONS = {
  pending: ClockIcon,
  sent: CheckIcon,
  delivered: DoubleCheckIcon,
  read: DoubleCheckIcon,
  failed: AlertIcon,
} as const

/** Иконка статуса доставки (часы / галочка / две галочки / ошибка) */
export function DeliveryStatusIcon({ status, className }: { status: DeliveryStatus; className?: string }) {
  const IconComponent = ICONS[status]
  return (
    <IconComponent
      aria-hidden
      className={cn(status === 'pending' ? 'size-3.5' : 'size-4', status === 'failed' && 'text-destructive', className)}
    />
  )
}

/** Статус доставки с подписью в подсказке */
export function DeliveryStatusIndicator({ status }: { status: DeliveryStatus }) {
  return (
    <WithTooltip content={DELIVERY_STATUS_LABELS[status]}>
      <span className="inline-flex" role="img" aria-label={DELIVERY_STATUS_LABELS[status]}>
        <DeliveryStatusIcon status={status} />
      </span>
    </WithTooltip>
  )
}
