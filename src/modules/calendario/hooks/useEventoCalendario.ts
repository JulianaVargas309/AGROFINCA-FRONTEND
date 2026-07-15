import { useState, useEffect, useCallback, useRef } from "react"
import { calendarioService } from "../services/calendario.service"
import type { EventoCalendario } from "../types/calendario.types"

interface UseEventoCalendarioReturn {
  evento: EventoCalendario | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useEventoCalendario(id: number | null): UseEventoCalendarioReturn {
  const [evento, setEvento] = useState<EventoCalendario | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchEvento = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const result = await calendarioService.findById(id)
      if (mountedRef.current) setEvento(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar el evento")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    mountedRef.current = true
    fetchEvento()
    return () => { mountedRef.current = false }
  }, [fetchEvento])

  return { evento, loading, error, refetch: fetchEvento }
}
