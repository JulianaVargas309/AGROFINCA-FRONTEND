import { useContext } from "react"
import { NotificationContext } from "@/context/NotificationContext"
import type { NotificationContextType } from "@/context/NotificationContext"

export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification debe usarse dentro de un NotificationProvider")
  }
  return context
}
