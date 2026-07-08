import { useState, useEffect, useCallback, useRef } from "react"
import { loteService } from "../services/lote.service"
import type { Lote } from "../types/lote.types"

interface Finca {
  id: number
  nombre: string
}

interface UseLotesReturn {
  lotes: Lote[]
  fincas: Finca[]
  fincaSeleccionada: number | null
  loading: boolean
  error: string | null
  search: string
  setSearch: (search: string) => void
  setFinca: (fincaId: number) => void
  refetch: () => Promise<void>
}

export function useLotes(): UseLotesReturn {
  const [lotes, setLotes] = useState<Lote[]>([])
  const [fincas, setFincas] = useState<Finca[]>([])
  const [fincaSeleccionada, setFincaState] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const mountedRef = useRef(true)

  const fetchFincas = useCallback(async () => {
    try {
      const result = await loteService.fetchFincas()
      if (mountedRef.current) {
        setFincas(result)
        if (result.length > 0 && !fincaSeleccionada) {
          setFincaState(result[0].id)
        }
      }
    } catch {
      // silent
    }
  }, [fincaSeleccionada])

  const fetchLotes = useCallback(async () => {
    if (!fincaSeleccionada) {
      setLotes([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await loteService.findAll(fincaSeleccionada)
      if (mountedRef.current) setLotes(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar lotes")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [fincaSeleccionada])

  useEffect(() => {
    mountedRef.current = true
    fetchFincas()
    return () => { mountedRef.current = false }
  }, [fetchFincas])

  useEffect(() => {
    fetchLotes()
  }, [fetchLotes])

  const setFinca = useCallback((fincaId: number) => {
    setFincaState(fincaId)
    setSearch("")
  }, [])

  const filtered = lotes.filter((l) =>
    search ? l.nombre.toLowerCase().includes(search.toLowerCase()) : true,
  )

  return {
    lotes: filtered,
    fincas,
    fincaSeleccionada,
    loading,
    error,
    search,
    setSearch,
    setFinca,
    refetch: fetchLotes,
  }
}
