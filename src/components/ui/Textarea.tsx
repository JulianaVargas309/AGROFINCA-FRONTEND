import { type TextareaHTMLAttributes, forwardRef } from "react"
import { cn } from "@/utils/cn"

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-stone-700 dark:text-stone-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={4}
          className={cn(
            "rounded-lg border border-stone-300 bg-white dark:border-stone-700 dark:bg-stone-800 px-3 py-2 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
            "disabled:cursor-not-allowed disabled:bg-stone-50 dark:disabled:bg-stone-900 disabled:text-stone-500 dark:disabled:text-stone-400",
            "resize-vertical",
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  },
)

Textarea.displayName = "Textarea"

export { Textarea }
export type { TextareaProps }
