import { useMutation, useQueryClient } from '@tanstack/react-query'
import { chatActions } from '@/entities/chat'
import { useSessionStore } from '@/entities/session'
import {
  defaultApiUrl,
  getStateInstance,
  greenApiKeys,
  type Credentials,
  type StateInstance,
} from '@/shared/api'
import type { SignInValues } from '../model/sign-in-schema'

const STATE_ERRORS: Record<Exclude<StateInstance, 'authorized'>, string> = {
  notAuthorized: 'Инстанс не авторизован — привяжите аккаунт Telegram в личном кабинете GREEN-API',
  blocked: 'Аккаунт Telegram заблокирован',
  starting: 'Инстанс запускается, попробуйте через пару минут',
  suspended: 'На аккаунте временные ограничения',
  pendingPassword: 'Завершите авторизацию: требуется облачный пароль Telegram',
}

/** Проверяет ключи через getStateInstance и начинает сессию только для авторизованного инстанса */
export function useSignInMutation() {
  const queryClient = useQueryClient()
  const startSession = useSessionStore((state) => state.start)

  return useMutation({
    mutationFn: async (values: SignInValues): Promise<Credentials> => {
      const credentials: Credentials = {
        idInstance: values.idInstance,
        apiTokenInstance: values.apiTokenInstance,
        apiUrl: values.apiUrl || defaultApiUrl(values.idInstance),
      }
      const { stateInstance } = await getStateInstance(credentials)
      if (stateInstance !== 'authorized') {
        throw new Error(STATE_ERRORS[stateInstance] ?? `Состояние инстанса: ${stateInstance}`)
      }
      return credentials
    },
    onSuccess: (credentials) => {
      // Прогреваем кэш: экрану чатов не нужно повторно запрашивать состояние инстанса
      queryClient.setQueryData(greenApiKeys.instanceState(credentials.idInstance), { stateInstance: 'authorized' })
      chatActions().assignOwner(credentials.idInstance)
      startSession(credentials)
    },
  })
}
