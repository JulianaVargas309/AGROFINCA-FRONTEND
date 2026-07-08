import { type ReactNode, useEffect, useCallback } from "react"
import { cn } from "@/utils/cn"
import { X } from "lucide-react"

type ModalSize = "sm" | "md" | "lg" | "xl"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: ModalSize
  closable?: boolean
  children: ReactNode
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
}

function Modal({ isOpen, onClose, title, size = "md", closable = true, children }: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={closable ? onClose : undefined}
      />
      <div
        className={cn(
          "relative z-10 w-full rounded-xl bg-white shadow-xl",
          sizeClasses[size],
          "mx-4 max-h-[90vh] overflow-auto",
        )}
      >
        {(title || closable) && (
          <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
            {title && <h2 className="text-lg font-semibold text-stone-900">{title}</h2>}
            {closable && (
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  )
}

export { Modal }
export type { ModalProps, ModalSize }
