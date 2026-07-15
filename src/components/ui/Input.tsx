import { type InputHTMLAttributes, type ReactNode, forwardRef, useState } from "react"
import { cn } from "@/utils/cn"
import { Eye, EyeOff } from "lucide-react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className, id, type: initialType, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = initialType === "password"
    const resolvedType = isPassword && showPassword ? "text" : initialType

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-stone-700 dark:text-stone-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            className={cn(
              "rounded-lg border border-stone-300 bg-white dark:border-stone-700 dark:bg-stone-800 px-3 py-2 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 w-full",
              "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
              "disabled:cursor-not-allowed disabled:bg-stone-50 dark:disabled:bg-stone-900 disabled:text-stone-500 dark:disabled:text-stone-400",
              icon ? "pl-10" : "",
              isPassword ? "pr-10" : "",
              error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "",
              className,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-stone-500 dark:text-stone-400">{helperText}</p>
        )}
      </div>
    )
  },
)

Input.displayName = "Input"

export { Input }
export type { InputProps }
