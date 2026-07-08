import { useState, useCallback } from "react"
import { useAuth } from "@/hooks/useAuth"
import type { RegisterInput } from "../schemas/register.schema"

export function useRegister() {
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRegister = useCallback(
    async (data: RegisterInput) => {
      setLoading(true)
      setError(null)
      try {
        await register({ documento: data.documento, rol: data.rol })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al registrarse. Intenta de nuevo."
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [register],
  )

  const clearError = useCallback(() => setError(null), [])

  return { register: handleRegister, loading, error, clearError }
}
