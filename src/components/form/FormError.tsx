import type { ReactNode } from "react"
import { cn } from "@/utils/cn"

interface FormErrorProps {
  children?: ReactNode
  message?: string
  className?: string
}

function FormError({ children, message, className }: FormErrorProps) {
  const text = message || children
  if (!text) return null
  return (
    <p className={cn("text-xs text-red-600 dark:text-red-400", className)}>
      {text}
    </p>
  )
}

export { FormError }
export type { FormErrorProps }
