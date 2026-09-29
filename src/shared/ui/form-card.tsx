import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import type { Icon } from './icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './primitives/card'

interface FormCardProps {
  icon?: Icon
  title: string
  description?: ReactNode
  children: ReactNode
  className?: string
}

/** Карточка с заголовком и иконкой для отдельных форм (вход, настройки) */
export function FormCard({ icon: IconComponent, title, description, children, className }: FormCardProps) {
  return (
    <Card className={cn('w-full max-w-sm', className)}>
      <CardHeader className="items-center text-center">
        {IconComponent && (
          <div className="mx-auto mb-2 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <IconComponent className="size-7" aria-hidden />
          </div>
        )}
        <CardTitle className="text-xl">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
