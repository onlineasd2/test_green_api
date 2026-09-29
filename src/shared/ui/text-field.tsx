import { useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import { Field, FieldDescription, FieldError, FieldLabel } from './primitives/field'
import { Input } from './primitives/input'

const INPUT_VARIANTS = {
  default: '',
  pill: 'h-10 rounded-full bg-muted px-4 focus-visible:bg-background',
} as const

export interface TextFieldProps extends Omit<ComponentProps<'input'>, 'children'> {
  label?: string
  description?: ReactNode
  error?: string
  variant?: keyof typeof INPUT_VARIANTS
  /** Элемент справа от поля (например, кнопка отправки) */
  addon?: ReactNode
  fieldClassName?: string
}

/** Поле ввода с подписью, описанием и ошибкой; связывает их через id и aria-атрибуты */
export function TextField({
  id,
  label,
  description,
  error,
  variant = 'default',
  addon,
  className,
  fieldClassName,
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const isInvalid = Boolean(error)

  const input = (
    <Input
      id={inputId}
      aria-invalid={isInvalid}
      className={cn(INPUT_VARIANTS[variant], className)}
      {...inputProps}
    />
  )

  return (
    <Field data-invalid={isInvalid} className={cn(addon && 'gap-1.5', fieldClassName)}>
      {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
      {addon ? (
        <div className="flex gap-2">
          {input}
          {addon}
        </div>
      ) : (
        input
      )}
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError className={cn(variant === 'pill' && 'px-2 text-xs')}>{error}</FieldError>
    </Field>
  )
}
