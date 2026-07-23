import type { ReactNode } from "react"
import { cn } from "@/utils/cn"

interface FormActionsProps {
  children: ReactNode
  align?: "left" | "center" | "right"
  className?: string
}

const alignClasses = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
}

function FormActions({ children, align = "right", className }: FormActionsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3 pt-6", alignClasses[align], className)}>
      {children}
    </div>
  )
}

export { FormActions }
export type { FormActionsProps }
