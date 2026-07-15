import { useState, useEffect, useCallback, useRef } from "react"
import { presupuestoService } from "../services/presupuestos.service"
import type { Presupuesto } from "../types/presupuestos.types"
import type { PaginationState } from "@/types"

interface UsePresupuestosReturn {
  presupuestos: Presupuesto[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  estadoFiltro: string
  setEstadoFiltro: (estado: string) => void
  setPage: (page: number) => void
  refetch: () => Promise<void>
}

export function usePresupuestos(limit: number = 10): UsePresupuestosReturn {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, limit, total: 0, totalPages: 1 })
  const [estadoFiltro, setEstadoFiltro] = useState("")
  const mountedRef = useRef(true)

  const fetchPresupuestos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await presupuestoService.findAll(pagination.page, pagination.limit, estadoFiltro || undefined)
      if (!mountedRef.current) return
      if (Array.isArray(result)) {
        setPresupuestos(result)
        setPagination((prev) => ({ ...prev, total: result.length, totalPages: 1 }))
      } else {
        setPresupuestos(result.data)
        setPagination((prev) => ({ ...prev, total: result.meta.total, totalPages: result.meta.totalPages }))
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar presupuestos")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [pagination.page, pagination.limit, estadoFiltro])

  useEffect(() => {
    mountedRef.current = true
    fetchPresupuestos()
    return () => { mountedRef.current = false }
  }, [fetchPresupuestos])

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  return { presupuestos, loading, error, pagination, estadoFiltro, setEstadoFiltro, setPage, refetch: fetchPresupuestos }
}
