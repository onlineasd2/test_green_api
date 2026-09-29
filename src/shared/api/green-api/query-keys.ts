import { queryOptions } from '@tanstack/react-query'
import { INSTANCE_STATE_REFETCH_MS } from '@/shared/config'
import { getStateInstance } from './methods'
import type { Credentials } from './types'

/** Фабрика ключей — единая точка для инвалидации и доступа к кэшу */
export const greenApiKeys = {
  all: ['green-api'] as const,
  instance: (idInstance: string) => [...greenApiKeys.all, 'instance', idInstance] as const,
  instanceState: (idInstance: string) => [...greenApiKeys.instance(idInstance), 'state'] as const,
}

export function instanceStateQueryOptions(credentials: Credentials) {
  return queryOptions({
    queryKey: greenApiKeys.instanceState(credentials.idInstance),
    queryFn: ({ signal }) => getStateInstance(credentials, signal),
    refetchInterval: INSTANCE_STATE_REFETCH_MS,
    select: (data) => data.stateInstance,
  })
}
