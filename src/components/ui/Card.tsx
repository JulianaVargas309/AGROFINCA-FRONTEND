import { cn } from "@/utils/cn"
import type { ReactNode, HTMLAttributes } from "react"

type CardPadding = "none" | "sm" | "md" | "lg"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding
  shadow?: boolean
  children: ReactNode
}

const paddingClasses: Record<CardPadding, string> = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-8",
}

function Card({ padding = "md", shadow = true, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-stone-200 bg-white text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100",
        paddingClasses[padding],
        shadow && "shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Card }
export type { CardProps, CardPadding }
