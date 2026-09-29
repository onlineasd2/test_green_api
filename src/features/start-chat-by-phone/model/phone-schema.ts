import { z } from 'zod'
import { isValidPhone, normalizePhone } from '@/shared/lib/format'

export const phoneSchema = z.object({
  phone: z
    .string()
    .transform(normalizePhone)
    .refine(isValidPhone, 'Введите номер в международном формате, например +7 999 123-45-67'),
})

export type PhoneFormInput = z.input<typeof phoneSchema>
export type PhoneFormOutput = z.output<typeof phoneSchema>
