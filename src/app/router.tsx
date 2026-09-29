import { lazy, Suspense } from 'react'
import { useInstanceId } from '@/entities/session'

// Страницы грузятся отдельными чанками: на входе не нужен код мессенджера и наоборот
const SignInPage = lazy(() => import('@/pages/sign-in').then((m) => ({ default: m.SignInPage })))
const MessengerPage = lazy(() => import('@/pages/messenger').then((m) => ({ default: m.MessengerPage })))

/** Выбор страницы по наличию сессии (без URL-роутинга — в приложении два экрана) */
export function AppRouter() {
  const idInstance = useInstanceId()

  return (
    <Suspense fallback={<div className="h-dvh bg-chat" />}>
      {/* key пересоздаёт экран (и цикл получения сообщений) при смене инстанса */}
      {idInstance ? <MessengerPage key={idInstance} /> : <SignInPage />}
    </Suspense>
  )
}
