import { useQuery } from '@tanstack/react-query'
import { instanceStateQueryOptions } from '@/shared/api'
import { useCredentials } from '../model/use-session'

/** Периодически перепроверяет, что инстанс всё ещё авторизован в Telegram */
export function useInstanceState() {
  const credentials = useCredentials()
  const { data: state } = useQuery(instanceStateQueryOptions(credentials))

  return { state, isUnauthorized: state !== undefined && state !== 'authorized' }
}
