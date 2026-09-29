import { InstanceStateWarning, useInstanceId } from '@/entities/session'
import { ConnectionErrorAlert, ConnectionStatus } from '@/features/receive-messages'
import { SignOutButton } from '@/features/sign-out'
import { StartChatForm } from '@/features/start-chat-by-phone'
import { cn } from '@/shared/lib/utils'
import { ChatList } from './chat-list'

/** Боковая панель: шапка со статусом, новый чат по номеру, предупреждения, список чатов */
export function ChatListPanel({ className }: { className?: string }) {
  const idInstance = useInstanceId()

  return (
    <aside className={cn('flex-col border-r bg-background', className)}>
      <header className="flex items-center justify-between gap-3 px-4 pt-4 pb-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold">Чаты</h1>
          <p className="text-xs text-muted-foreground">
            <ConnectionStatus /> · {idInstance}
          </p>
        </div>
        <SignOutButton />
      </header>

      <div className="flex flex-col gap-2 px-3 pb-2">
        <StartChatForm />
        <InstanceStateWarning />
        <ConnectionErrorAlert />
      </div>

      <ChatList />
    </aside>
  )
}
