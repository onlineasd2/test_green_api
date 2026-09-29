import { useCallback } from 'react'
import { useHasActiveChat } from '@/entities/chat'
import { useMessagePolling } from '@/features/receive-messages'
import { useSignOut } from '@/features/sign-out'
import { notify } from '@/shared/lib/notify'

/** Запускает получение сообщений на время жизни экрана и отдаёт состояние раскладки */
export function useMessengerPage() {
  const signOut = useSignOut()

  const handleUnauthorized = useCallback(() => {
    notify.error('Ключи инстанса больше не действуют', 'Войдите заново')
    signOut()
  }, [signOut])

  useMessagePolling({ onUnauthorized: handleUnauthorized })

  return { hasActiveChat: useHasActiveChat() }
}
