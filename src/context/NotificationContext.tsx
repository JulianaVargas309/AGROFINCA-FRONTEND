import { createContext, useState, useCallback, type ReactNode } from "react"

export type NotificationType = "success" | "error" | "warning" | "info"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
}

export interface NotificationContextType {
  notifications: Notification[]
  notify: (notification: Omit<Notification, "id">) => void
  dismiss: (id: string) => void
  clearAll: () => void
}

export const NotificationContext = createContext<NotificationContextType | null>(null)

let notificationId = 0

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const notify = useCallback(
    (notification: Omit<Notification, "id">) => {
      const id = String(++notificationId)
      const newNotification: Notification = { ...notification, id }

      setNotifications((prev) => [...prev, newNotification])

      const duration = notification.duration ?? 5000
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration)
      }
    },
    [dismiss],
  )

  return (
    <NotificationContext value={{ notifications, notify, dismiss, clearAll }}>
      {children}
    </NotificationContext>
  )
}
