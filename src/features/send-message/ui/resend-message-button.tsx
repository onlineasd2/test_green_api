import { DeliveryStatusIcon, type Message } from '@/entities/message'
import { WithTooltip } from '@/shared/ui'
import { useSendMessageMutation } from '../api/use-send-message-mutation'

interface ResendMessageButtonProps {
  chatId: string
  message: Message
}

/** Иконка ошибки доставки, по нажатию отправляет сообщение повторно */
export function ResendMessageButton({ chatId, message }: ResendMessageButtonProps) {
  const { resend } = useSendMessageMutation()

  return (
    <WithTooltip content="Не отправлено — нажмите, чтобы повторить">
      <button
        type="button"
        className="inline-flex"
        aria-label="Отправить повторно"
        onClick={() => resend(chatId, message.id, message.text)}
      >
        <DeliveryStatusIcon status="failed" />
      </button>
    </WithTooltip>
  )
}
