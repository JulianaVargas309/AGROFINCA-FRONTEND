import { useState, useEffect, useCallback, useRef } from "react"
import { usersService } from "../services/users.service"
import type { User } from "../types/user.types"

interface UseUserReturn {
  user: User | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useUser(id: number | null): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchUser = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const result = await usersService.findById(id)
      if (mountedRef.current) setUser(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar el usuario")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    mountedRef.current = true
    fetchUser()
    return () => { mountedRef.current = false }
  }, [fetchUser])

  return { user, loading, error, refetch: fetchUser }
}
