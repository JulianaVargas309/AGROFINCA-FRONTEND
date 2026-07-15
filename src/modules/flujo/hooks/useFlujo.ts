import { useState, useEffect, useCallback, useRef } from "react"
import { flujoService } from "../services/flujo.service"
import type { FlujoEfectivo } from "../types/flujo.types"

interface UseFlujoReturn {
  flujo: FlujoEfectivo | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useFlujo(id: number | null): UseFlujoReturn {
  const [flujo, setFlujo] = useState<FlujoEfectivo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchFlujo = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const result = await flujoService.findById(id)
      if (mountedRef.current) setFlujo(result)
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
    fetchFlujo()
    return () => { mountedRef.current = false }
  }, [fetchFlujo])

  return { flujo, loading, error, refetch: fetchFlujo }
}
