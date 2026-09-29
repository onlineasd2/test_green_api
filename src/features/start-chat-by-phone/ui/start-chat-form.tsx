import { FormTextField, IconButton, PlusIcon } from '@/shared/ui'
import { useStartChatForm } from '../model/use-start-chat-form'

/** Поле номера получателя + кнопка «создать чат» */
export function StartChatForm() {
  const { control, onSubmit, onPhoneChange, isSubmitting, canSubmit, serverError } = useStartChatForm()

  return (
    <form noValidate onSubmit={onSubmit}>
      <FormTextField
        control={control}
        name="phone"
        variant="pill"
        type="tel"
        autoComplete="tel"
        placeholder="Номер телефона получателя"
        aria-label="Номер телефона получателя"
        externalError={serverError}
        onChange={onPhoneChange}
        addon={
          <IconButton
            type="submit"
            icon={PlusIcon}
            label="Создать чат"
            variant="primary"
            loading={isSubmitting}
            disabled={!canSubmit}
          />
        }
      />
    </form>
  )
}
