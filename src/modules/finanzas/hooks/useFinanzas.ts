import { useState, useEffect, useCallback, useRef } from "react"
import { finanzaService } from "../services/finanza.service"
import type { Gasto, Venta, FinanzasSummary } from "../types/finanza.types"

interface UseFinanzasReturn {
  gastos: Gasto[]
  ventas: Venta[]
  summary: FinanzasSummary | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useFinanzas(): UseFinanzasReturn {
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [ventas, setVentas] = useState<Venta[]>([])
  const [summary, setSummary] = useState<FinanzasSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [gs, vs, sm] = await Promise.all([
        finanzaService.findAllGastos().catch(() => [] as Gasto[]),
        finanzaService.findAllVentas().catch(() => [] as Venta[]),
        finanzaService.fetchSummary().catch(() => null),
      ])
      if (mountedRef.current) {
        setGastos(gs)
        setVentas(vs)
        setSummary(sm)
      }
    } catch (err) {
      if (mountedRef.current) setError(err instanceof Error ? err.message : "Error al cargar finanzas")
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    fetchData()
    return () => { mountedRef.current = false }
  }, [fetchData])

  return { gastos, ventas, summary, loading, error, refetch: fetchData }
}
