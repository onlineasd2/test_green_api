import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { defaultApiUrl } from '@/shared/api'
import { useSignInMutation } from '../api/use-sign-in-mutation'
import { signInSchema, type SignInValues } from './sign-in-schema'

/** Логика формы входа: валидация, отправка, состояние запроса. UI — в sign-in-form.tsx */
export function useSignInForm() {
  const signIn = useSignInMutation()
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { idInstance: '', apiTokenInstance: '', apiUrl: '' },
  })
  const idInstance = useWatch({ control: form.control, name: 'idInstance' })

  return {
    control: form.control,
    onSubmit: form.handleSubmit((values) => signIn.mutate(values)),
    isSubmitting: signIn.isPending,
    submitError: signIn.error?.message ?? null,
    /** Подсказка: какой apiUrl будет использован, если поле оставить пустым */
    apiUrlPlaceholder: defaultApiUrl(idInstance),
  }
}
