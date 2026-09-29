import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { useStartChatMutation } from '../api/use-start-chat-mutation'
import { phoneSchema, type PhoneFormInput, type PhoneFormOutput } from './phone-schema'

/** Логика формы «новый чат по номеру»: нормализация и валидация номера, поиск собеседника */
export function useStartChatForm() {
  const startChat = useStartChatMutation()
  const form = useForm<PhoneFormInput, unknown, PhoneFormOutput>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  })
  const phone = useWatch({ control: form.control, name: 'phone' })

  return {
    control: form.control,
    onSubmit: form.handleSubmit(({ phone: normalized }) =>
      startChat.mutate(normalized, { onSuccess: () => form.reset() }),
    ),
    /** Ошибка сервера сбрасывается, как только пользователь начинает править номер */
    onPhoneChange: () => {
      if (startChat.isError) startChat.reset()
    },
    isSubmitting: startChat.isPending,
    canSubmit: phone.trim().length > 0 && !startChat.isPending,
    serverError: startChat.error?.message,
  }
}
