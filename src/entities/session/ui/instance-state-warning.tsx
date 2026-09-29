import { ErrorAlert } from '@/shared/ui'
import { useInstanceState } from '../api/use-instance-state'

export function InstanceStateWarning({ className }: { className?: string }) {
  const { state, isUnauthorized } = useInstanceState()
  if (!isUnauthorized) return null

  return (
    <ErrorAlert className={className}>
      Инстанс не авторизован ({state}) — проверьте его в личном кабинете GREEN-API
    </ErrorAlert>
  )
}
