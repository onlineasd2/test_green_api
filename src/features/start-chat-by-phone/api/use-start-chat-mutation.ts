import { useMutation } from '@tanstack/react-query'
import { chatActions } from '@/entities/chat'
import { useCredentials } from '@/entities/session'
import { checkAccount, GreenApiError, isAuthError } from '@/shared/api'

export class NoTelegramAccountError extends Error {
  constructor() {
    super('У этого номера нет аккаунта в Telegram или номер скрыт настройками приватности')
    this.name = 'NoTelegramAccountError'
  }
}

/**
 * Находит chatId собеседника по номеру (CheckAccount) и открывает чат.
 * Если проверка недоступна (лимиты, сбой сервера), пишем по номеру "7999...@c.us" —
 * настоящий chatId подставится из первого входящего сообщения.
 */
export function useStartChatMutation() {
  const credentials = useCredentials()

  return useMutation({
    mutationFn: async (phone: string) => {
      const known = chatActions().chats.find((chat) => chat.phone === phone)
      if (known) return { chatId: known.chatId, phone }

      try {
        const account = await checkAccount(credentials, phone)
        if (!account.exist) throw new NoTelegramAccountError()
        return { chatId: account.chatId || `${phone}@c.us`, phone }
      } catch (error) {
        if (error instanceof GreenApiError && !isAuthError(error)) return { chatId: `${phone}@c.us`, phone }
        throw error
      }
    },
    onSuccess: ({ chatId, phone }) => chatActions().openChat(chatId, phone),
  })
}
