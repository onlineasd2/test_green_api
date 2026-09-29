import { useEffect, useRef } from 'react'
import { useCredentials } from '@/entities/session'
import { deleteNotification, isAuthError, receiveNotification } from '@/shared/api'
import { INITIAL_RECEIVE_TIMEOUT_SEC, POLLING_RETRY_DELAY_MS, RECEIVE_TIMEOUT_SEC } from '@/shared/config'
import { wait } from '@/shared/lib/async'
import { applyNotification } from './apply-notification'
import { useConnectionStore } from './connection-store'

interface UseMessagePollingOptions {
  /** Ключи отозваны (401/403) — решение, что делать, принимает вызывающий слой */
  onUnauthorized: () => void
}

/**
 * Получение сообщений через HTTP API: ReceiveNotification (long polling) → обработка → DeleteNotification.
 *
 * Это бесконечный поток событий, а не кэшируемые данные, поэтому он живёт в эффекте с AbortController,
 * а не в useQuery. События попадают в стор чатов, статус канала — в connection-store.
 */
export function useMessagePolling({ onUnauthorized }: UseMessagePollingOptions) {
  const credentials = useCredentials()
  const onUnauthorizedRef = useRef(onUnauthorized)

  useEffect(() => {
    onUnauthorizedRef.current = onUnauthorized
  }, [onUnauthorized])

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    const connection = useConnectionStore.getState()
    connection.reset()

    async function poll() {
      let receiveTimeout = INITIAL_RECEIVE_TIMEOUT_SEC
      while (!signal.aborted) {
        try {
          const notification = await receiveNotification(credentials, signal, receiveTimeout)
          receiveTimeout = RECEIVE_TIMEOUT_SEC
          connection.setOnline()
          if (!notification) continue

          try {
            applyNotification(notification.body)
          } catch (error) {
            console.error('Не удалось обработать уведомление', notification, error)
          }
          // Удаляем уведомление в любом случае, иначе очередь «застрянет» на нём; дубликаты отсекаются по id
          await deleteNotification(credentials, notification.receiptId, signal)
        } catch (error) {
          if (signal.aborted) return
          if (isAuthError(error)) {
            onUnauthorizedRef.current()
            return
          }
          connection.setError(error instanceof Error ? error.message : 'Ошибка получения сообщений')
          await wait(POLLING_RETRY_DELAY_MS, signal)
        }
      }
    }

    void poll()
    return () => controller.abort()
  }, [credentials])
}
