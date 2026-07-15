import { useState, useEffect, useCallback, useRef } from "react"
import { rolesService } from "../services/roles.service"
import type { Role } from "../types/role.types"

interface UseRolesReturn {
  roles: Role[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useRoles(): UseRolesReturn {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchRoles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await rolesService.findAll()
      if (mountedRef.current) setRoles(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar roles")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    fetchRoles()
    return () => { mountedRef.current = false }
  }, [fetchRoles])

  return { roles, loading, error, refetch: fetchRoles }
}
