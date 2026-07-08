import { Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { LoadingPage } from "@/components/shared/LoadingPage"
import type { ReactNode } from "react"

interface PublicRouteProps {
  children: ReactNode
}

function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <LoadingPage />

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />
  }

  return <>{children}</>
}

export { PublicRoute }
