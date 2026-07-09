import { useState, useEffect, useCallback, useRef } from "react"
import { movimientoService } from "../services/movimiento.service"
import type { Movimiento } from "../types/movimiento.types"
import type { PaginationState } from "@/types"

interface UseMovimientosReturn {
  movimientos: Movimiento[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  search: string
  setSearch: (search: string) => void
  setPage: (page: number) => void
  refetch: () => Promise<void>
}

export function useMovimientos(limit: number = 10): UseMovimientosReturn {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1, limit, total: 0, totalPages: 1,
  })
  const [search, setSearch] = useState("")
  const mountedRef = useRef(true)

  const fetchMovimientos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await movimientoService.findAll(pagination.page, pagination.limit)
      if (!mountedRef.current) return
      if (Array.isArray(result)) {
        setMovimientos(result)
        setPagination((prev) => ({ ...prev, total: result.length, totalPages: 1 }))
      } else {
        setMovimientos(result.data)
        setPagination((prev) => ({ ...prev, total: result.meta.total, totalPages: result.meta.totalPages }))
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar movimientos")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    mountedRef.current = true
    fetchMovimientos()
    return () => { mountedRef.current = false }
  }, [fetchMovimientos])

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  const filtered = movimientos.filter((m) =>
    search
      ? m.tipo.toLowerCase().includes(search.toLowerCase()) ||
        m.descripcion?.toLowerCase().includes(search.toLowerCase())
      : true
  )

  return { movimientos: filtered, loading, error, pagination, search, setSearch, setPage, refetch: fetchMovimientos }
}
