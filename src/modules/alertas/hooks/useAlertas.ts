import { useState, useEffect, useCallback, useRef } from "react"
import { alertaService } from "../services/alerta.service"
import type { Alerta } from "../types/alertas.types"

interface UseAlertasReturn {
  alertas: Alerta[]
  loading: boolean
  error: string | null
  leidaFilter: boolean | undefined
  setLeidaFilter: (leida: boolean | undefined) => void
  refetch: () => Promise<void>
}

export function useAlertas(): UseAlertasReturn {
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [leidaFilter, setLeidaFilter] = useState<boolean | undefined>(undefined)
  const mountedRef = useRef(true)

  const fetchAlertas = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await alertaService.findAll(leidaFilter)
      if (mountedRef.current) setAlertas(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar alertas")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [leidaFilter])

  useEffect(() => {
    mountedRef.current = true
    fetchAlertas()
    return () => { mountedRef.current = false }
  }, [fetchAlertas])

  return { alertas, loading, error, leidaFilter, setLeidaFilter, refetch: fetchAlertas }
}
