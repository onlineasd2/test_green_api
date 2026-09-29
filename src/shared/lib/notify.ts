import { toast } from 'sonner'

/** Обёртка над библиотекой тостов — слайсы не зависят от конкретной реализации */
export const notify = {
  error: (title: string, description?: string) => toast.error(title, { description }),
  success: (title: string, description?: string) => toast.success(title, { description }),
}
