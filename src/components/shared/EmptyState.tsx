import { Inbox } from "lucide-react"
import { Button } from "@/components/ui/Button"
import type { ReactNode } from "react"

interface EmptyStateProps {
  icon?: ReactNode
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

function EmptyState({
  icon,
  title = "Sin datos",
  description = "No hay información disponible.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500">
        {icon || <Inbox size={28} />}
      </div>
      <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300">{title}</h3>
      <p className="max-w-sm text-sm text-stone-500 dark:text-stone-400">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export { EmptyState }
export type { EmptyStateProps }
