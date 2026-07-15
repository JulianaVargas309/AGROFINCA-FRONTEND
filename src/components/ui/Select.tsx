import { type SelectHTMLAttributes, forwardRef } from "react"
import { cn } from "@/utils/cn"
import type { Option } from "@/types"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Option<string>[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-stone-700 dark:text-stone-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "rounded-lg border border-stone-300 bg-white dark:border-stone-700 dark:bg-stone-800 px-3 py-2 text-sm text-stone-900 dark:text-stone-100",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
            "disabled:cursor-not-allowed disabled:bg-stone-50 dark:disabled:bg-stone-900 disabled:text-stone-500 dark:disabled:text-stone-400",
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>
    )
  },
)

Select.displayName = "Select"

export { Select }
export type { SelectProps }
