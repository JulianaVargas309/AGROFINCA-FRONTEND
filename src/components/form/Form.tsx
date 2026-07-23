import type { FormHTMLAttributes, ReactNode } from "react"
import { cn } from "@/utils/cn"

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode
}

function Form({ className, children, ...props }: FormProps) {
  return (
    <form className={cn("space-y-5", className)} {...props}>
      {children}
    </form>
  )
}

export { Form }
export type { FormProps }
