import { useState, useEffect, useCallback, useRef } from "react"
import { flujoService } from "../services/flujo.service"
import type { FlujoEfectivo, ResumenFlujo } from "../types/flujo.types"

interface UseFlujosReturn {
  flujos: FlujoEfectivo[]
  resumen: ResumenFlujo | null
  loading: boolean
  error: string | null
  fechaDesde: string
  fechaHasta: string
  tipoFiltro: string
  setFechaDesde: (fecha: string) => void
  setFechaHasta: (fecha: string) => void
  setTipoFiltro: (tipo: string) => void
  refetch: () => Promise<void>
}

function getDefaultDates() {
  const now = new Date()
  const first = new Date(now.getFullYear(), now.getMonth(), 1)
  return {
    desde: first.toISOString().split("T")[0],
    hasta: now.toISOString().split("T")[0],
  }
}

export function useFlujos(): UseFlujosReturn {
  const defaults = getDefaultDates()
  const [flujos, setFlujos] = useState<FlujoEfectivo[]>([])
  const [resumen, setResumen] = useState<ResumenFlujo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fechaDesde, setFechaDesde] = useState(defaults.desde)
  const [fechaHasta, setFechaHasta] = useState(defaults.hasta)
  const [tipoFiltro, setTipoFiltro] = useState("")
  const mountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [flujoResult, resumenResult] = await Promise.all([
        flujoService.findAll(fechaDesde, fechaHasta, tipoFiltro || undefined),
        flujoService.getResumen(fechaDesde, fechaHasta),
      ])
      if (!mountedRef.current) return
      setFlujos(Array.isArray(flujoResult) ? flujoResult : flujoResult.data)
      setResumen(resumenResult)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar flujo de efectivo")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [fechaDesde, fechaHasta, tipoFiltro])

  useEffect(() => {
    mountedRef.current = true
    fetchData()
    return () => { mountedRef.current = false }
  }, [fetchData])

  const filtered = flujos.filter((f) =>
    tipoFiltro ? f.tipo === tipoFiltro : true
  )

  return {
    flujos: filtered,
    resumen,
    loading,
    error,
    fechaDesde,
    fechaHasta,
    tipoFiltro,
    setFechaDesde,
    setFechaHasta,
    setTipoFiltro,
    refetch: fetchData,
  }
}
