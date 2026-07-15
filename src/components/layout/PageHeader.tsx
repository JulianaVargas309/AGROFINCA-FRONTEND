import { cn } from "@/utils/cn"
import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">{title}</h1>
        {description && <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{description}</p>}
      </div>
      {actions && <div className="mt-3 flex items-center gap-2 sm:mt-0">{actions}</div>}
    </div>
  )
}

export { PageHeader }
export type { PageHeaderProps }
