import { useState, useEffect, useCallback, useRef } from "react"
import { movimientoService } from "../services/movimiento.service"
import type { Movimiento } from "../types/movimiento.types"

interface UseMovimientoReturn {
  movimiento: Movimiento | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useMovimiento(id: number | null): UseMovimientoReturn {
  const [movimiento, setMovimiento] = useState<Movimiento | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchMovimiento = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const result = await movimientoService.findById(id)
      if (mountedRef.current) setMovimiento(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar el movimiento")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    mountedRef.current = true
    fetchMovimiento()
    return () => { mountedRef.current = false }
  }, [fetchMovimiento])

  return { movimiento, loading, error, refetch: fetchMovimiento }
}
