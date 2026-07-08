import { type ReactNode } from "react"
import { AuthProvider } from "@/context/AuthContext"
import { NotificationProvider } from "@/context/NotificationContext"
import { ToastContainer } from "@/components/shared/ToastContainer"
import "@/services/interceptors"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        {children}
        <ToastContainer />
      </NotificationProvider>
    </AuthProvider>
  )
}
