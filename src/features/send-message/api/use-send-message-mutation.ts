import { useMutation } from '@tanstack/react-query'
import { chatActions } from '@/entities/chat'
import { useCredentials } from '@/entities/session'
import { sendMessage } from '@/shared/api'
import { createId } from '@/shared/lib/async'
import { notify } from '@/shared/lib/notify'

interface SendVariables {
  chatId: string
  text: string
  localId: string
}

/**
 * Отправка через SendMessage с оптимистичным обновлением:
 * сообщение сразу появляется в чате со статусом «отправляется», затем получает idMessage или статус ошибки.
 */
export function useSendMessageMutation() {
  const credentials = useCredentials()

  const mutation = useMutation({
    mutationKey: ['send-message'],
    // Мутации с общим scope выполняются по очереди — сообщения уходят в том порядке, в котором написаны
    scope: { id: 'send-message' },
    mutationFn: ({ chatId, text }: SendVariables) => sendMessage(credentials, chatId, text),
    onMutate: ({ chatId, text, localId }) => {
      chatActions().addMessage({
        chatId,
        message: { id: localId, text, timestamp: Date.now(), direction: 'outgoing', status: 'pending' },
      })
    },
    onSuccess: ({ idMessage }, { localId }) => chatActions().confirmMessage(localId, idMessage),
    onError: (error, { localId }) => {
      chatActions().setMessageStatus(localId, 'failed')
      notify.error('Сообщение не отправлено', error.message)
    },
  })

  return {
    send: (chatId: string, text: string) => mutation.mutate({ chatId, text, localId: createId('local') }),
    /** Повтор неудачной отправки: старая копия удаляется, сообщение уходит заново */
    resend: (chatId: string, messageId: string, text: string) => {
      chatActions().removeMessage(messageId)
      mutation.mutate({ chatId, text, localId: createId('local') })
    },
  }
}
