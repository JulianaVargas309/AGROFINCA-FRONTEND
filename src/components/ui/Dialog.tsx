import { type ReactNode } from "react"
import { cn } from "@/utils/cn"
import { AlertTriangle } from "lucide-react"
import { Button } from "./Button"

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "warning" | "info"
  loading?: boolean
  icon?: ReactNode
}

const variantStyles = {
  danger: {
    icon: "text-red-600",
    button: "danger" as const,
  },
  warning: {
    icon: "text-amber-600",
    button: "secondary" as const,
  },
  info: {
    icon: "text-emerald-600",
    button: "primary" as const,
  },
}

function Dialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "info",
  loading = false,
  icon,
}: DialogProps) {
  if (!isOpen) return null

  const style = variantStyles[variant]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100", style.icon)}>
            {icon || <AlertTriangle size={20} />}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
            <p className="mt-1 text-sm text-stone-600">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={style.button} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { Dialog }
export type { DialogProps }
