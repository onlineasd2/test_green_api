/** Максимальная длина текста в методе SendMessage для Telegram */
export const MESSAGE_MAX_LENGTH = 4096

/** Сколько секунд сервер держит запрос ReceiveNotification (5–60) */
export const RECEIVE_TIMEOUT_SEC = 20

/** Короткий первый запрос — чтобы быстро показать статус подключения */
export const INITIAL_RECEIVE_TIMEOUT_SEC = 5

export const POLLING_RETRY_DELAY_MS = 5000

/** Как часто перепроверять состояние инстанса */
export const INSTANCE_STATE_REFETCH_MS = 60_000

export const STORAGE_KEYS = {
  session: 'green-api-auth',
  chats: 'tg-chats',
} as const

export const GREEN_API_CONSOLE_URL = 'https://console.green-api.com'
