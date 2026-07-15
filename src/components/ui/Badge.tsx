import { cn } from "@/utils/cn"
import type { ReactNode } from "react"

type BadgeColor = "default" | "success" | "warning" | "error" | "info"

interface BadgeProps {
  color?: BadgeColor
  children: ReactNode
  className?: string
}

const colorClasses: Record<BadgeColor, string> = {
  default: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
  success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  info: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
}

function Badge({ color = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        colorClasses[color],
        className,
      )}
    >
      {children}
    </span>
  )
}

export { Badge }
export type { BadgeProps, BadgeColor }
