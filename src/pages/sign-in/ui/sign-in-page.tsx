import { SignInForm } from '@/features/sign-in'
import { GREEN_API_CONSOLE_URL } from '@/shared/config'
import { FormCard, PaperPlaneIcon } from '@/shared/ui'

export function SignInPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-chat p-4">
      <FormCard
        icon={PaperPlaneIcon}
        title="Вход в чат Telegram"
        description={
          <>
            Данные инстанса из{' '}
            <a
              className="text-primary underline-offset-4 hover:underline"
              href={GREEN_API_CONSOLE_URL}
              target="_blank"
              rel="noreferrer"
            >
              личного кабинета GREEN-API
            </a>
          </>
        }
      >
        <SignInForm />
      </FormCard>
    </main>
  )
}
