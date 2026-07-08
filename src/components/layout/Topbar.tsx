import type { ReactNode } from "react"
import { cn } from "@/utils/cn"

interface TopbarProps {
  children?: ReactNode
  className?: string
}

function Topbar({ children, className }: TopbarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 sm:px-6",
        className,
      )}
    >
      {children}
    </div>
  )
}

export { Topbar }
export type { TopbarProps }
