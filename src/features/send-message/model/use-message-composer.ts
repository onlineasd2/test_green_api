import { useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react'
import { MESSAGE_MAX_LENGTH } from '@/shared/config'
import { useSendMessageMutation } from '../api/use-send-message-mutation'

/** Логика поля ввода: черновик, Enter — отправить, Shift+Enter — перенос строки */
export function useMessageComposer(chatId: string) {
  const { send } = useSendMessageMutation()
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const canSend = draft.trim().length > 0

  function submit() {
    if (!canSend) return
    send(chatId, draft.trim())
    setDraft('')
    inputRef.current?.focus()
  }

  return {
    inputRef,
    draft,
    canSend,
    maxLength: MESSAGE_MAX_LENGTH,
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => setDraft(event.target.value),
    onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => {
      // Не мешаем вводу через IME (китайский, японский и т.п.)
      if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
        event.preventDefault()
        submit()
      }
    },
    onSubmit: (event: FormEvent) => {
      event.preventDefault()
      submit()
    },
  }
}
