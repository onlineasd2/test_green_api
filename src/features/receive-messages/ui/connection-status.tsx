import { StatusDot, type StatusTone } from '@/shared/ui'
import { useConnectionStore, type ConnectionStatus as Status } from '../model/connection-store'

const VIEW: Record<Status, { label: string; tone: StatusTone }> = {
  connecting: { label: 'Подключение…', tone: 'neutral' },
  online: { label: 'В сети', tone: 'success' },
  error: { label: 'Нет связи', tone: 'danger' },
}

/** Индикатор канала получения сообщений: «В сети» / «Нет связи» */
export function ConnectionStatus() {
  const status = useConnectionStore((state) => state.status)
  const error = useConnectionStore((state) => state.error)
  const { label, tone } = VIEW[status]

  return (
    <span className="inline-flex items-center gap-1.5" title={error ?? undefined} role="status">
      <StatusDot tone={tone} />
      {label}
    </span>
  )
}
