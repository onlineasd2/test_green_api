import { ErrorAlert } from '@/shared/ui'
import { useConnectionStore } from '../model/connection-store'

export function ConnectionErrorAlert({ className }: { className?: string }) {
  const error = useConnectionStore((state) => (state.status === 'error' ? state.error : null))
  if (!error) return null
  return <ErrorAlert className={className}>{error}</ErrorAlert>
}
