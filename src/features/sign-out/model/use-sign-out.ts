import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useSessionStore } from '@/entities/session'
import { greenApiKeys } from '@/shared/api'

/** Завершает сессию и чистит серверный кэш. Чаты остаются привязанными к инстансу */
export function useSignOut() {
  const queryClient = useQueryClient()
  const endSession = useSessionStore((state) => state.end)

  return useCallback(() => {
    endSession()
    queryClient.removeQueries({ queryKey: greenApiKeys.all })
  }, [endSession, queryClient])
}
