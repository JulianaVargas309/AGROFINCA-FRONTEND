import { useState, useCallback } from "react"
import { useAuth } from "@/hooks/useAuth"
import type { LoginInput } from "../types/auth.types"

export function useLogin() {
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = useCallback(
    async (data: LoginInput) => {
      setLoading(true)
      setError(null)
      try {
        await login({ documento: data.documento, password: data.password })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al iniciar sesión. Verifica tus credenciales."
        setError(message)
        if (import.meta.env.DEV) {
          console.error("[useLogin]", err)
        }
        throw err
      } finally {
        setLoading(false)
      }
    },
    [login],
  )

  const clearError = useCallback(() => setError(null), [])

  return { login: handleLogin, loading, error, clearError }
}
