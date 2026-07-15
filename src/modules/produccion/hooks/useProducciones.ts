import { useState, useEffect, useCallback, useRef } from "react"
import { produccionService } from "../services/produccion.service"
import type { Produccion } from "../types/produccion.types"
import type { PaginationState } from "@/types"

export interface ProduccionFilters {
  cultivoId?: number
  loteId?: number
  temporadaId?: number
  fechaDesde?: string
  fechaHasta?: string
}

interface UseProduccionesReturn {
  producciones: Produccion[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  filters: ProduccionFilters
  setFilter: (key: keyof ProduccionFilters, value: number | string | undefined) => void
  clearFilters: () => void
  setPage: (page: number) => void
  refetch: () => Promise<void>
}

export function useProducciones(limit: number = 10): UseProduccionesReturn {
  const [producciones, setProducciones] = useState<Produccion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit,
    total: 0,
    totalPages: 1,
  })
  const [filters, setFilters] = useState<ProduccionFilters>({})
  const mountedRef = useRef(true)

  const fetchProducciones = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await produccionService.findAll(pagination.page, pagination.limit, filters)
      if (!mountedRef.current) return

      if (Array.isArray(result)) {
        setProducciones(result)
        setPagination((prev) => ({ ...prev, total: result.length, totalPages: 1 }))
      } else {
        setProducciones(result.data)
        setPagination((prev) => ({ ...prev, total: result.meta.total, totalPages: result.meta.totalPages }))
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar registros de producción")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [pagination.page, pagination.limit, filters.cultivoId, filters.loteId, filters.temporadaId, filters.fechaDesde, filters.fechaHasta])

  useEffect(() => {
    mountedRef.current = true
    fetchProducciones()
    return () => { mountedRef.current = false }
  }, [fetchProducciones])

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  const setFilter = useCallback((key: keyof ProduccionFilters, value: number | string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [])

  return { producciones, loading, error, pagination, filters, setFilter, clearFilters, setPage, refetch: fetchProducciones }
}
