import { useState, useEffect, useCallback, useRef } from "react"
import { produccionService } from "../services/produccion.service"
import type { Produccion } from "../types/produccion.types"

interface UseProduccionReturn {
  produccion: Produccion | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useProduccion(id: number | null): UseProduccionReturn {
  const [produccion, setProduccion] = useState<Produccion | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchProduccion = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const result = await produccionService.findById(id)
      if (mountedRef.current) setProduccion(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar el registro de producción")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    mountedRef.current = true
    fetchProduccion()
    return () => { mountedRef.current = false }
  }, [fetchProduccion])

  return { produccion, loading, error, refetch: fetchProduccion }
}
