import { Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { LoadingPage } from "@/components/shared/LoadingPage"
import type { ReactNode } from "react"

interface PrivateRouteProps {
  children: ReactNode
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <LoadingPage />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export { PrivateRoute }
