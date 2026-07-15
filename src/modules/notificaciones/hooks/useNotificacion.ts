import { useState, useEffect, useCallback, useRef } from "react"
import { notificacionService } from "../services/notificaciones.service"
import type { Notificacion } from "../types/notificaciones.types"

interface UseNotificacionReturn {
  notificacion: Notificacion | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useNotificacion(id: number | null): UseNotificacionReturn {
  const [notificacion, setNotificacion] = useState<Notificacion | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchNotificacion = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const result = await notificacionService.findById(id)
      if (mountedRef.current) setNotificacion(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar la notificación")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    mountedRef.current = true
    fetchNotificacion()
    return () => { mountedRef.current = false }
  }, [fetchNotificacion])

  return { notificacion, loading, error, refetch: fetchNotificacion }
}
