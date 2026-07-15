import { useState, useEffect, useCallback, useRef } from "react"
import { temporadaService } from "../services/temporada.service"
import type { Temporada } from "../types/temporada.types"

interface UseTemporadaReturn {
  temporada: Temporada | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useTemporada(id: number | null): UseTemporadaReturn {
  const [temporada, setTemporada] = useState<Temporada | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchTemporada = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const result = await temporadaService.findById(id)
      if (mountedRef.current) setTemporada(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar la temporada")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    mountedRef.current = true
    fetchTemporada()
    return () => { mountedRef.current = false }
  }, [fetchTemporada])

  return { temporada, loading, error, refetch: fetchTemporada }
}
