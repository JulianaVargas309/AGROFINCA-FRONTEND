import { cn } from "@/utils/cn"
import type { ReactNode } from "react"
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react"
import type { Severity } from "@/types"

interface AlertProps {
  severity?: Severity
  title?: string
  children: ReactNode
  className?: string
  onClose?: () => void
}

const severityStyles: Record<Severity, { container: string; icon: string }> = {
  success: {
    container: "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300",
    icon: "text-emerald-500 dark:text-emerald-400",
  },
  warning: {
    container: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300",
    icon: "text-amber-500 dark:text-amber-400",
  },
  error: {
    container: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300",
    icon: "text-red-500 dark:text-red-400",
  },
  info: {
    container: "bg-sky-50 border-sky-200 text-sky-800 dark:bg-sky-900/20 dark:border-sky-800 dark:text-sky-300",
    icon: "text-sky-500 dark:text-sky-400",
  },
}

const severityIcons: Record<Severity, ReactNode> = {
  success: <CheckCircle2 size={18} />,
  warning: <AlertTriangle size={18} />,
  error: <AlertCircle size={18} />,
  info: <Info size={18} />,
}

function Alert({ severity = "info", title, children, className, onClose }: AlertProps) {
  const style = severityStyles[severity]

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 text-sm",
        style.container,
        className,
      )}
      role="alert"
    >
      <span className={cn("shrink-0 mt-0.5", style.icon)}>
        {severityIcons[severity]}
      </span>
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? "mt-1" : ""}>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 rounded p-0.5 hover:bg-black/5 cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M14 1.41L12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7 14 1.41z" />
          </svg>
        </button>
      )}
    </div>
  )
}

export { Alert }
export type { AlertProps }
