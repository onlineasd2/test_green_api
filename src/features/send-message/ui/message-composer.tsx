import { AutosizeTextarea, IconButton, SendIcon } from '@/shared/ui'
import { useMessageComposer } from '../model/use-message-composer'

export function MessageComposer({ chatId }: { chatId: string }) {
  const { inputRef, draft, canSend, maxLength, onChange, onKeyDown, onSubmit } = useMessageComposer(chatId)

  return (
    <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-3xl items-end gap-2 px-3 pb-4 md:px-6">
      <AutosizeTextarea
        ref={inputRef}
        value={draft}
        onChange={onChange}
        onKeyDown={onKeyDown}
        maxLength={maxLength}
        placeholder="Сообщение"
        aria-label="Сообщение"
        autoFocus
      />
      <IconButton
        type="submit"
        icon={SendIcon}
        label="Отправить"
        variant="primary"
        size="xl"
        showTooltip={false}
        disabled={!canSend}
        className="shadow-sm disabled:bg-background disabled:text-muted-foreground disabled:opacity-100"
      />
    </form>
  )
}
