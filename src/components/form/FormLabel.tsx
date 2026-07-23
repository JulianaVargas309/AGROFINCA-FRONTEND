import type { LabelHTMLAttributes, ReactNode } from "react"
import { cn } from "@/utils/cn"

interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode
  required?: boolean
}

function FormLabel({ children, required, className, ...props }: FormLabelProps) {
  return (
    <label
      className={cn("text-sm font-medium text-stone-700 dark:text-stone-300", className)}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  )
}

export { FormLabel }
export type { FormLabelProps }
