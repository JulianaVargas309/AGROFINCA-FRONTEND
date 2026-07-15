import { useState, useEffect, useCallback, useRef } from "react"
import { permisosService } from "../services/permisos.service"
import type { Permiso } from "../types/permiso.types"

interface UsePermisosReturn {
  permisos: Permiso[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function usePermisos(): UsePermisosReturn {
  const [permisos, setPermisos] = useState<Permiso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchPermisos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await permisosService.findAll()
      if (mountedRef.current) setPermisos(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar permisos")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    fetchPermisos()
    return () => { mountedRef.current = false }
  }, [fetchPermisos])

  return { permisos, loading, error, refetch: fetchPermisos }
}
