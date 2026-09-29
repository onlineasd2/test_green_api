import { ErrorAlert, FormTextField, LoadingButton } from '@/shared/ui'
import { useSignInForm } from '../model/use-sign-in-form'

export function SignInForm() {
  const { control, onSubmit, isSubmitting, submitError, apiUrlPlaceholder } = useSignInForm()

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
      <FormTextField
        control={control}
        name="idInstance"
        label="idInstance"
        placeholder="4100000000"
        inputMode="numeric"
        autoComplete="username"
        autoFocus
      />
      <FormTextField
        control={control}
        name="apiTokenInstance"
        label="apiTokenInstance"
        type="password"
        placeholder="d75b3a66374942c5b3c019c698abc2067e151558acbd4512"
        autoComplete="current-password"
      />
      <FormTextField
        control={control}
        name="apiUrl"
        label="apiUrl"
        placeholder={apiUrlPlaceholder}
        autoComplete="url"
        description="Необязательно — по умолчанию определяется по idInstance"
      />

      {submitError && <ErrorAlert>{submitError}</ErrorAlert>}

      <LoadingButton type="submit" fullWidth loading={isSubmitting} loadingText="Проверяем…">
        Войти
      </LoadingButton>
    </form>
  )
}
