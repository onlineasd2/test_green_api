import { useEffect, useRef } from 'react'

/** Прокручивает контейнер к якорю в конце при изменении dependency (например, числа сообщений) */
export function useScrollToBottom<T extends HTMLElement = HTMLDivElement>(dependency: unknown) {
  const anchorRef = useRef<T>(null)

  useEffect(() => {
    anchorRef.current?.scrollIntoView({ block: 'end' })
  }, [dependency])

  return anchorRef
}
