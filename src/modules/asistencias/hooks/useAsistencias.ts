import { useState, useEffect, useCallback, useRef } from "react"
import { asistenciaService } from "../services/asistencia.service"
import type { Asistencia } from "../types/asistencias.types"
import type { PaginationState } from "@/types"

interface UseAsistenciasReturn {
  asistencias: Asistencia[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  fechaFilter: string | undefined
  setFechaFilter: (fecha: string | undefined) => void
  trabajadorFilter: number | undefined
  setTrabajadorFilter: (id: number | undefined) => void
  setPage: (page: number) => void
  refetch: () => Promise<void>
}

export function useAsistencias(limit: number = 10): UseAsistenciasReturn {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1, limit, total: 0, totalPages: 1,
  })
  const [fechaFilter, setFechaFilter] = useState<string | undefined>(undefined)
  const [trabajadorFilter, setTrabajadorFilter] = useState<number | undefined>(undefined)
  const mountedRef = useRef(true)

  const fetchAsistencias = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await asistenciaService.findAll(fechaFilter, trabajadorFilter, pagination.page, pagination.limit)
      if (!mountedRef.current) return
      if (Array.isArray(result)) {
        setAsistencias(result)
        setPagination((prev) => ({ ...prev, total: result.length, totalPages: 1 }))
      } else {
        setAsistencias(result.data)
        setPagination((prev) => ({ ...prev, total: result.meta.total, totalPages: result.meta.totalPages }))
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar asistencias")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [fechaFilter, trabajadorFilter, pagination.page, pagination.limit])

  useEffect(() => {
    mountedRef.current = true
    fetchAsistencias()
    return () => { mountedRef.current = false }
  }, [fetchAsistencias])

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  return { asistencias, loading, error, pagination, fechaFilter, setFechaFilter, trabajadorFilter, setTrabajadorFilter, setPage, refetch: fetchAsistencias }
}
