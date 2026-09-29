import { QueryClient } from '@tanstack/react-query'
import { isAuthError } from './green-api'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // Неверные ключи повторять бессмысленно
      retry: (failureCount, error) => !isAuthError(error) && failureCount < 2,
    },
    mutations: {
      // Повтор отправки может продублировать сообщение — повторяет только пользователь
      retry: false,
    },
  },
})
