import { useState, useEffect, useCallback, useRef } from "react"
import { historialLaboralService } from "../services/historial-laboral.service"
import type { HistorialLaboral } from "../types/historial-laboral.types"

interface UseHistorialLaboralReturn {
  historial: HistorialLaboral | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useHistorialLaboral(id: number | null): UseHistorialLaboralReturn {
  const [historial, setHistorial] = useState<HistorialLaboral | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchHistorial = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const result = await historialLaboralService.findById(id)
      if (mountedRef.current) setHistorial(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar el registro")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    mountedRef.current = true
    fetchHistorial()
    return () => { mountedRef.current = false }
  }, [fetchHistorial])

  return { historial, loading, error, refetch: fetchHistorial }
}
