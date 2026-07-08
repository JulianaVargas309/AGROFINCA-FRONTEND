import { useState, useEffect, useCallback, useRef } from "react"
import { bitacoraService } from "../services/bitacora.service"
import type { Bitacora, BitacoraFilters } from "../types/bitacora.types"

interface Finca { id: number; nombre: string }
interface Lote { id: number; nombre: string; fincaId: number }
interface Cultivo { id: number; nombre: string; tipo: string; loteId: number }

interface UseBitacoraReturn {
  registros: Bitacora[]
  fincas: Finca[]
  lotes: Lote[]
  cultivos: Cultivo[]
  loading: boolean
  error: string | null
  filters: BitacoraFilters
  setFilter: (key: keyof BitacoraFilters, value: number | string | undefined) => void
  clearFilters: () => void
  refetch: () => Promise<void>
}

export function useBitacora(limit: number = 20): UseBitacoraReturn {
  const [registros, setRegistros] = useState<Bitacora[]>([])
  const [fincas, setFincas] = useState<Finca[]>([])
  const [lotes, setLotes] = useState<Lote[]>([])
  const [cultivos, setCultivos] = useState<Cultivo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<BitacoraFilters>({ limit })
  const mountedRef = useRef(true)

  useEffect(() => {
    bitacoraService.fetchFincas().then(async (f) => {
      setFincas(f)
      if (f.length > 0) {
        const allLotes = await Promise.all(
          f.map((fin) => bitacoraService.fetchLotes(fin.id).catch(() => [] as Lote[]))
        )
        setLotes(allLotes.flat())
      }
    }).catch(() => {})
  }, [])

  const fetchCultivos = useCallback(async (loteId: number) => {
    try {
      const result = await bitacoraService.fetchCultivos(loteId)
      if (mountedRef.current) setCultivos(result)
    } catch { setCultivos([]) }
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await bitacoraService.findAll(filters)
      if (mountedRef.current) {
        setRegistros(Array.isArray(result) ? result : result.data)
      }
    } catch (err) {
      if (mountedRef.current) setError(err instanceof Error ? err.message : "Error al cargar bitácora")
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const setFilter = useCallback((key: keyof BitacoraFilters, value: number | string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
    if (key === "loteId" && typeof value === "number") {
      fetchCultivos(value)
    }
  }, [fetchCultivos])

  const clearFilters = useCallback(() => {
    setFilters({ limit })
  }, [limit])

  return { registros, fincas, lotes, cultivos, loading, error, filters, setFilter, clearFilters, refetch: fetchData }
}
