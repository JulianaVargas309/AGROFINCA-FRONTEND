import { type InputHTMLAttributes, forwardRef, useRef, useEffect } from "react"
import { cn } from "@/utils/cn"

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
  indeterminate?: boolean
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, indeterminate, className, id, ...props }, ref) => {
    const innerRef = useRef<HTMLInputElement>(null)
    const resolvedRef = ref || innerRef
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, "-")

    useEffect(() => {
      if (typeof resolvedRef === "object" && resolvedRef?.current) {
        resolvedRef.current.indeterminate = indeterminate ?? false
      }
    }, [indeterminate, resolvedRef])

    return (
      <label htmlFor={checkboxId} className="inline-flex items-center gap-2 cursor-pointer">
        <input
          ref={resolvedRef}
          type="checkbox"
          id={checkboxId}
          className={cn(
            "h-4 w-4 rounded border-stone-300 dark:border-stone-600 text-emerald-600 focus:ring-emerald-500 cursor-pointer",
            className,
          )}
          {...props}
        />
        {label && <span className="text-sm text-stone-700 dark:text-stone-300">{label}</span>}
      </label>
    )
  },
)

Checkbox.displayName = "Checkbox"

export { Checkbox }
export type { CheckboxProps }
