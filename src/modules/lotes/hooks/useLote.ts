import { useState, useEffect, useCallback, useRef } from "react"
import { loteService } from "../services/lote.service"
import type { Lote } from "../types/lote.types"

interface CultivoSummary {
  id: number
  nombre: string
  tipo: string
  estado: string
  fechaSiembra: string
}

interface BitacoraEntry {
  id: number
  actividad: string
  descripcion: string
  fecha: string
  costo: number
  lote: { id: number; nombre: string }
  cultivo?: { id: number; nombre: string }
}

interface JornalEntry {
  id: number
  fecha: string
  tipoPago: string
  total: number
  trabajador: { id: number; nombre: string }
}

interface LoteDetailData {
  lote: Lote | null
  cultivos: CultivoSummary[]
  bitacoras: BitacoraEntry[]
  jornales: JornalEntry[]
  costoTotal: number
  costoJornales: number
  costoBitacora: number
}

interface UseLoteReturn {
  data: LoteDetailData
  loading: boolean
  error: string | null
  saving: boolean
  deleting: boolean
  updateLote: (id: number, input: Partial<Lote>) => Promise<void>
  deleteLote: (id: number) => Promise<void>
  refetch: () => Promise<void>
}

export function useLote(id: number | null): UseLoteReturn {
  const [data, setData] = useState<LoteDetailData>({
    lote: null,
    cultivos: [],
    bitacoras: [],
    jornales: [],
    costoTotal: 0,
    costoJornales: 0,
    costoBitacora: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const mountedRef = useRef(true)

  const fetchDetail = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const result = await loteService.fetchDetail(id)
      if (mountedRef.current) setData(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar el lote")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    mountedRef.current = true
    fetchDetail()
    return () => { mountedRef.current = false }
  }, [fetchDetail])

  const updateLote = useCallback(async (loteId: number, input: Partial<Lote>) => {
    setSaving(true)
    setError(null)
    try {
      const updated = await loteService.update(loteId, input)
      if (mountedRef.current) {
        setData((prev) => ({ ...prev, lote: updated }))
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al actualizar")
      }
    } finally {
      if (mountedRef.current) setSaving(false)
    }
  }, [])

  const deleteLote = useCallback(async (loteId: number) => {
    setDeleting(true)
    setError(null)
    try {
      await loteService.remove(loteId)
      if (mountedRef.current) {
        setData((prev) => (prev.lote ? { ...prev, lote: { ...prev.lote, activo: false } } : prev))
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al eliminar")
      }
    } finally {
      if (mountedRef.current) setDeleting(false)
    }
  }, [])

  return { data, loading, error, saving, deleting, updateLote, deleteLote, refetch: fetchDetail }
}
