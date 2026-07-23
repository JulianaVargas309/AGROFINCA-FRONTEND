import type { ReactNode } from "react"
import { cn } from "@/utils/cn"

interface FormSectionProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <div>
          <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300">
            {title}
          </h4>
          {description && (
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

export { FormSection }
export type { FormSectionProps }
