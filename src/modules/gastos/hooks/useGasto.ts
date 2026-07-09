import { useState, useEffect, useCallback, useRef } from "react"
import { gastoService } from "../services/gasto.service"
import type { Gasto } from "../types/gasto.types"

interface UseGastoReturn {
  gasto: Gasto | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useGasto(id: number | null): UseGastoReturn {
  const [gasto, setGasto] = useState<Gasto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchGasto = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const result = await gastoService.findById(id)
      if (mountedRef.current) setGasto(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar el gasto")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    mountedRef.current = true
    fetchGasto()
    return () => { mountedRef.current = false }
  }, [fetchGasto])

  return { gasto, loading, error, refetch: fetchGasto }
}
