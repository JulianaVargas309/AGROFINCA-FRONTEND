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
        "border-t border-stone-200 bg-white px-6 py-4 text-center text-xs text-stone-400",
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
