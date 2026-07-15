import { cn } from "@/utils/cn"
import type { ReactNode } from "react"

interface FooterProps {
  className?: string
  children?: ReactNode
}

function Footer({ className, children }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer
      className={cn(
        "border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 px-6 py-4 text-center text-xs text-stone-400 dark:text-stone-500",
        className,
      )}
    >
      {children ?? (
        <p>
          &copy; {year} AgroFinca Familiar. Todos los derechos reservados.
        </p>
      )}
    </footer>
  )
}

export { Footer }
export type { FooterProps }
