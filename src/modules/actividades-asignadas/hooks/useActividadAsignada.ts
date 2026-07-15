import { useState, useEffect, useCallback, useRef } from "react"
import { actividadAsignadaService } from "../services/actividades-asignadas.service"
import type { ActividadAsignada } from "../types/actividades-asignadas.types"

interface UseActividadAsignadaReturn {
  actividad: ActividadAsignada | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useActividadAsignada(id: number | null): UseActividadAsignadaReturn {
  const [actividad, setActividad] = useState<ActividadAsignada | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchActividad = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const result = await actividadAsignadaService.findById(id)
      if (mountedRef.current) setActividad(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar la actividad")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    mountedRef.current = true
    fetchActividad()
    return () => { mountedRef.current = false }
  }, [fetchActividad])

  return { actividad, loading, error, refetch: fetchActividad }
}
