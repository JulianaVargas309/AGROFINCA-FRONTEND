import { useState, useEffect, useCallback, useRef } from "react"
import { asistenciaService } from "../services/asistencia.service"
import type { Asistencia } from "../types/asistencias.types"

interface UseAsistenciaReturn {
  asistencia: Asistencia | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useAsistencia(id: number | null): UseAsistenciaReturn {
  const [asistencia, setAsistencia] = useState<Asistencia | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchAsistencia = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const result = await asistenciaService.findById(id)
      if (mountedRef.current) setAsistencia(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar la asistencia")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    mountedRef.current = true
    fetchAsistencia()
    return () => { mountedRef.current = false }
  }, [fetchAsistencia])

  return { asistencia, loading, error, refetch: fetchAsistencia }
}
