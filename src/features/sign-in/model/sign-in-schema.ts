import { z } from 'zod'

export const signInSchema = z.object({
  idInstance: z
    .string()
    .trim()
    .min(1, 'Введите idInstance')
    .regex(/^\d+$/, 'idInstance состоит только из цифр'),
  apiTokenInstance: z.string().trim().min(1, 'Введите apiTokenInstance'),
  apiUrl: z
    .string()
    .trim()
    .refine((value) => value === '' || /^https?:\/\/[^\s/]+/.test(value), 'Адрес должен начинаться с https://'),
})

export type SignInValues = z.infer<typeof signInSchema>
