import { type ReactNode, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "@/context/AuthContext"
import { NotificationProvider } from "@/context/NotificationContext"
import { ThemeProvider } from "@/context/ThemeContext"
import { ToastContainer } from "@/components/shared/ToastContainer"
import "@/services/interceptors"

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            {children}
            <ToastContainer />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
