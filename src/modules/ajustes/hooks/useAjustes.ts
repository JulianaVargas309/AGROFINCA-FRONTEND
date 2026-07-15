import { useState, useEffect, useCallback, useRef } from "react"
import { ajusteService } from "../services/ajuste.service"
import type { Ajuste } from "../types/ajustes.types"
import type { PaginationState } from "@/types"

interface UseAjustesReturn {
  ajustes: Ajuste[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  productoFilter: number | undefined
  setProductoFilter: (id: number | undefined) => void
  setPage: (page: number) => void
  refetch: () => Promise<void>
}

export function useAjustes(limit: number = 10): UseAjustesReturn {
  const [ajustes, setAjustes] = useState<Ajuste[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1, limit, total: 0, totalPages: 1,
  })
  const [productoFilter, setProductoFilter] = useState<number | undefined>(undefined)
  const mountedRef = useRef(true)

  const fetchAjustes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await ajusteService.findAll(productoFilter, pagination.page, pagination.limit)
      if (!mountedRef.current) return
      if (Array.isArray(result)) {
        setAjustes(result)
        setPagination((prev) => ({ ...prev, total: result.length, totalPages: 1 }))
      } else {
        setAjustes(result.data)
        setPagination((prev) => ({ ...prev, total: result.meta.total, totalPages: result.meta.totalPages }))
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar ajustes")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [productoFilter, pagination.page, pagination.limit])

  useEffect(() => {
    mountedRef.current = true
    fetchAjustes()
    return () => { mountedRef.current = false }
  }, [fetchAjustes])

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  return { ajustes, loading, error, pagination, productoFilter, setProductoFilter, setPage, refetch: fetchAjustes }
}
