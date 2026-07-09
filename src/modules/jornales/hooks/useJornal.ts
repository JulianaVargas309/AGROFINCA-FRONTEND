import { useState, useEffect, useCallback, useRef } from "react"
import { jornalService } from "../services/jornal.service"
import type { Jornal } from "../types/jornal.types"

interface UseJornalReturn {
  jornal: Jornal | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useJornal(id: number | null): UseJornalReturn {
  const [jornal, setJornal] = useState<Jornal | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchJornal = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const result = await jornalService.findById(id)
      if (mountedRef.current) setJornal(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar el jornal")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    mountedRef.current = true
    fetchJornal()
    return () => { mountedRef.current = false }
  }, [fetchJornal])

  return { jornal, loading, error, refetch: fetchJornal }
}
