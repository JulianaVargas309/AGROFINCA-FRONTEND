import { useState, useEffect, useCallback, useRef } from "react"
import { calendarioService } from "../services/calendario.service"
import type { EventoCalendario } from "../types/calendario.types"

interface UseEventosCalendarioReturn {
  eventos: EventoCalendario[]
  loading: boolean
  error: string | null
  filtros: { fechaDesde?: string; fechaHasta?: string; tipo?: string }
  setFiltros: (filtros: { fechaDesde?: string; fechaHasta?: string; tipo?: string }) => void
  refetch: () => Promise<void>
}

export function useEventosCalendario(filtrosIniciales?: { fechaDesde?: string; fechaHasta?: string; tipo?: string }): UseEventosCalendarioReturn {
  const [eventos, setEventos] = useState<EventoCalendario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtros, setFiltros] = useState<{ fechaDesde?: string; fechaHasta?: string; tipo?: string }>(filtrosIniciales || {})
  const mountedRef = useRef(true)

  const fetchEventos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await calendarioService.findAll(filtros)
      if (mountedRef.current) setEventos(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar eventos")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [filtros])

  useEffect(() => {
    mountedRef.current = true
    fetchEventos()
    return () => { mountedRef.current = false }
  }, [fetchEventos])

  return { eventos, loading, error, filtros, setFiltros, refetch: fetchEventos }
}
