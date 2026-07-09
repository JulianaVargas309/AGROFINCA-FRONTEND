import { useState, useEffect, useCallback, useRef } from "react"
import { cultivoService } from "../services/cultivo.service"
import type { Cultivo } from "../types/cultivo.types"

interface UseCultivoReturn {
  cultivo: Cultivo | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useCultivo(id: number | null): UseCultivoReturn {
  const [cultivo, setCultivo] = useState<Cultivo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchCultivo = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const result = await cultivoService.findById(id)
      if (mountedRef.current) setCultivo(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar el cultivo")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    mountedRef.current = true
    fetchCultivo()
    return () => { mountedRef.current = false }
  }, [fetchCultivo])

  return { cultivo, loading, error, refetch: fetchCultivo }
}
