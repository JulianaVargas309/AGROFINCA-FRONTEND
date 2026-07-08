import { cn } from "@/utils/cn"
import type { ReactNode } from "react"

type BadgeColor = "default" | "success" | "warning" | "error" | "info"

interface BadgeProps {
  color?: BadgeColor
  children: ReactNode
  className?: string
}

const colorClasses: Record<BadgeColor, string> = {
  default: "bg-stone-100 text-stone-700",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  error: "bg-red-100 text-red-800",
  info: "bg-sky-100 text-sky-800",
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
