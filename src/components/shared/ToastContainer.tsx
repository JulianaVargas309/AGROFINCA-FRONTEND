import { useNotification } from "@/hooks/useNotification"
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/utils/cn"
import type { NotificationType } from "@/context/NotificationContext"
import type { ReactNode } from "react"

const iconMap: Record<NotificationType, ReactNode> = {
  success: <CheckCircle2 size={18} />,
  error: <AlertCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info: <Info size={18} />,
}

const colorMap: Record<NotificationType, string> = {
  success: "border-emerald-500 bg-emerald-50 text-emerald-800",
  error: "border-red-500 bg-red-50 text-red-800",
  warning: "border-amber-500 bg-amber-50 text-amber-800",
  info: "border-sky-500 bg-sky-50 text-sky-800",
}

function ToastContainer() {
  const { notifications, dismiss } = useNotification()

  if (notifications.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "flex items-start gap-3 rounded-lg border-l-4 bg-white px-4 py-3 shadow-lg animate-slide-in min-w-[320px] max-w-[420px]",
            colorMap[notification.type],
          )}
          role="alert"
        >
          <span className="shrink-0 mt-0.5">{iconMap[notification.type]}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{notification.title}</p>
            {notification.message && (
              <p className="text-xs mt-0.5 opacity-80">{notification.message}</p>
            )}
          </div>
          <button
            onClick={() => dismiss(notification.id)}
            className="shrink-0 rounded p-0.5 hover:bg-black/10 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}

export { ToastContainer }
