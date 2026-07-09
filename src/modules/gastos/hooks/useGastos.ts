import { useState, useEffect, useCallback, useRef } from "react"
import { gastoService } from "../services/gasto.service"
import type { Gasto } from "../types/gasto.types"
import type { PaginationState } from "@/types"

interface UseGastosReturn {
  gastos: Gasto[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  search: string
  setSearch: (search: string) => void
  setPage: (page: number) => void
  refetch: () => Promise<void>
}

export function useGastos(limit: number = 10): UseGastosReturn {
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1, limit, total: 0, totalPages: 1,
  })
  const [search, setSearch] = useState("")
  const mountedRef = useRef(true)

  const fetchGastos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await gastoService.findAll(pagination.page, pagination.limit)
      if (!mountedRef.current) return
      if (Array.isArray(result)) {
        setGastos(result)
        setPagination((prev) => ({ ...prev, total: result.length, totalPages: 1 }))
      } else {
        setGastos(result.data)
        setPagination((prev) => ({ ...prev, total: result.meta.total, totalPages: result.meta.totalPages }))
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar gastos")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    mountedRef.current = true
    fetchGastos()
    return () => { mountedRef.current = false }
  }, [fetchGastos])

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  const filtered = gastos.filter((g) =>
    search
      ? g.categoria.toLowerCase().includes(search.toLowerCase()) ||
        g.descripcion.toLowerCase().includes(search.toLowerCase())
      : true
  )

  return { gastos: filtered, loading, error, pagination, search, setSearch, setPage, refetch: fetchGastos }
}
