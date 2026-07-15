import { useState, useEffect, useCallback, useRef } from "react"
import { historialLaboralService } from "../services/historial-laboral.service"
import type { HistorialLaboral } from "../types/historial-laboral.types"
import type { PaginationState } from "@/types"

interface UseHistorialLaboralListReturn {
  historial: HistorialLaboral[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  trabajadorFilter: number | undefined
  setTrabajadorFilter: (id: number | undefined) => void
  setPage: (page: number) => void
  refetch: () => Promise<void>
}

export function useHistorialLaboralList(limit: number = 10): UseHistorialLaboralListReturn {
  const [historial, setHistorial] = useState<HistorialLaboral[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1, limit, total: 0, totalPages: 1,
  })
  const [trabajadorFilter, setTrabajadorFilter] = useState<number | undefined>(undefined)
  const mountedRef = useRef(true)

  const fetchHistorial = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await historialLaboralService.findAll(trabajadorFilter, pagination.page, pagination.limit)
      if (!mountedRef.current) return
      if (Array.isArray(result)) {
        setHistorial(result)
        setPagination((prev) => ({ ...prev, total: result.length, totalPages: 1 }))
      } else {
        setHistorial(result.data)
        setPagination((prev) => ({ ...prev, total: result.meta.total, totalPages: result.meta.totalPages }))
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar historial laboral")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [trabajadorFilter, pagination.page, pagination.limit])

  useEffect(() => {
    mountedRef.current = true
    fetchHistorial()
    return () => { mountedRef.current = false }
  }, [fetchHistorial])

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  return { historial, loading, error, pagination, trabajadorFilter, setTrabajadorFilter, setPage, refetch: fetchHistorial }
}
