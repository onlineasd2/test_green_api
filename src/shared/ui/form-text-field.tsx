import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { TextField, type TextFieldProps } from './text-field'

interface FormTextFieldProps<TValues extends FieldValues>
  extends Omit<TextFieldProps, 'name' | 'value' | 'defaultValue' | 'error'> {
  control: Control<TValues>
  name: FieldPath<TValues>
  /** Внешняя ошибка (например, от сервера) — показывается, если нет ошибки валидации */
  externalError?: string
}

/** TextField, подключённый к react-hook-form */
export function FormTextField<TValues extends FieldValues>({
  control,
  name,
  externalError,
  onChange,
  onBlur,
  ...props
}: FormTextFieldProps<TValues>) {
  const {
    field: { ref, ...field },
    fieldState,
  } = useController({ control, name })

  return (
    <TextField
      {...props}
      ref={ref}
      name={field.name}
      value={field.value ?? ''}
      disabled={field.disabled || props.disabled}
      error={fieldState.error?.message ?? externalError}
      onChange={(event) => {
        field.onChange(event)
        onChange?.(event)
      }}
      onBlur={(event) => {
        field.onBlur()
        onBlur?.(event)
      }}
    />
  )
}
