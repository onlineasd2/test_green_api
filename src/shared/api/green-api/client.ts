import type { Credentials } from './types'

export class GreenApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'GreenApiError'
    this.status = status
  }
}

export function isAuthError(error: unknown): boolean {
  return error instanceof GreenApiError && (error.status === 401 || error.status === 403)
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

function describeHttpError(status: number): string {
  if (status === 401 || status === 403) return 'Неверный idInstance или apiTokenInstance'
  if (status === 404) return 'Метод не найден — проверьте apiUrl'
  if (status === 429) return 'Слишком много запросов, попробуйте позже'
  if (status === 466) return 'Исчерпан лимит тарифа инстанса'
  if (status >= 500) return `Сервер GREEN-API недоступен (${status})`
  return `Ошибка запроса (${status})`
}

interface RequestOptions {
  httpMethod?: 'GET' | 'POST' | 'DELETE'
  /** Дополнительный сегмент пути после токена, например receiptId */
  path?: string
  query?: Record<string, string | number>
  body?: unknown
  signal?: AbortSignal
}

export function buildUrl(credentials: Credentials, method: string, { path, query }: RequestOptions = {}): string {
  const base = credentials.apiUrl.trim().replace(/\/+$/, '')
  const url = new URL(`${base}/waInstance${credentials.idInstance}/${method}/${credentials.apiTokenInstance}`)
  if (path) url.pathname += `/${path}`
  for (const [key, value] of Object.entries(query ?? {})) url.searchParams.set(key, String(value))
  return url.toString()
}

/** Общий транспорт GREEN-API: формирует URL, парсит JSON и приводит ошибки к GreenApiError */
export async function greenApiRequest<T>(
  credentials: Credentials,
  method: string,
  options: RequestOptions = {},
): Promise<T> {
  const { httpMethod = 'GET', body, signal } = options

  let response: Response
  try {
    response = await fetch(buildUrl(credentials, method, options), {
      method: httpMethod,
      signal,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    if (isAbortError(error)) throw error
    throw new GreenApiError('Нет соединения с сервером GREEN-API — проверьте apiUrl и интернет')
  }

  if (!response.ok) throw new GreenApiError(describeHttpError(response.status), response.status)

  const text = await response.text()
  return (text ? JSON.parse(text) : null) as T
}
