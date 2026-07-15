import { useState, useEffect, useCallback, useRef } from "react"
import { auditoriaService } from "../services/auditoria.service"
import type { AuditLog } from "../types/auditoria.types"
import type { PaginationState } from "@/types"

export interface AuditFilters {
  entidad?: string
  accion?: string
  fechaDesde?: string
  fechaHasta?: string
}

interface UseAuditoriasReturn {
  auditorias: AuditLog[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  filters: AuditFilters
  setFilter: (key: keyof AuditFilters, value: string | undefined) => void
  clearFilters: () => void
  setPage: (page: number) => void
  refetch: () => Promise<void>
}

export function useAuditorias(limit: number = 20): UseAuditoriasReturn {
  const [auditorias, setAuditorias] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit,
    total: 0,
    totalPages: 1,
  })
  const [filters, setFilters] = useState<AuditFilters>({})
  const mountedRef = useRef(true)

  const fetchAuditorias = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await auditoriaService.findAll(pagination.page, pagination.limit, filters)
      if (!mountedRef.current) return

      if (Array.isArray(result)) {
        setAuditorias(result)
        setPagination((prev) => ({ ...prev, total: result.length, totalPages: 1 }))
      } else {
        setAuditorias(result.data)
        setPagination((prev) => ({ ...prev, total: result.meta.total, totalPages: result.meta.totalPages }))
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar auditoría")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [pagination.page, pagination.limit, filters.entidad, filters.accion, filters.fechaDesde, filters.fechaHasta])

  useEffect(() => {
    mountedRef.current = true
    fetchAuditorias()
    return () => { mountedRef.current = false }
  }, [fetchAuditorias])

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  const setFilter = useCallback((key: keyof AuditFilters, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [])

  return { auditorias, loading, error, pagination, filters, setFilter, clearFilters, setPage, refetch: fetchAuditorias }
}
