import type { Credentials } from '@/shared/api'
import { useSessionStore } from './session-store'

export function useInstanceId(): string | undefined {
  return useSessionStore((state) => state.credentials?.idInstance)
}

/** Ключи текущей сессии — только для экранов, доступных после входа */
export function useCredentials(): Credentials {
  const credentials = useSessionStore((state) => state.credentials)
  if (!credentials) throw new Error('useCredentials вызван вне активной сессии')
  return credentials
}
