import type { DeliveryStatus } from '../model/types'

const RANK: Record<DeliveryStatus, number> = { pending: 0, sent: 1, delivered: 2, read: 3, failed: 4 }

export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  pending: 'Отправляется',
  sent: 'Отправлено',
  delivered: 'Доставлено',
  read: 'Прочитано',
  failed: 'Не отправлено',
}

/** Статусы только «растут»: запоздавший delivered не должен перезаписать read */
export function isStatusUpgrade(current: DeliveryStatus | undefined, next: DeliveryStatus): boolean {
  return RANK[next] > RANK[current ?? 'pending']
}
