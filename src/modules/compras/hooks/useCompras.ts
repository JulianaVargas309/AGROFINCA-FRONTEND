import { useState, useEffect, useCallback, useRef } from "react"
import { compraService } from "../services/compra.service"
import type { Compra } from "../types/compras.types"
import type { PaginationState } from "@/types"

interface UseComprasReturn {
  compras: Compra[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  search: string
  setSearch: (search: string) => void
  setPage: (page: number) => void
  refetch: () => Promise<void>
}

export function useCompras(limit: number = 10): UseComprasReturn {
  const [compras, setCompras] = useState<Compra[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1, limit, total: 0, totalPages: 1,
  })
  const [search, setSearch] = useState("")
  const mountedRef = useRef(true)

  const fetchCompras = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await compraService.findAll(pagination.page, pagination.limit)
      if (!mountedRef.current) return
      if (Array.isArray(result)) {
        setCompras(result)
        setPagination((prev) => ({ ...prev, total: result.length, totalPages: 1 }))
      } else {
        setCompras(result.data)
        setPagination((prev) => ({ ...prev, total: result.meta.total, totalPages: result.meta.totalPages }))
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar compras")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    mountedRef.current = true
    fetchCompras()
    return () => { mountedRef.current = false }
  }, [fetchCompras])

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  const filtered = compras.filter((c) =>
    search
      ? c.numeroFactura?.toLowerCase().includes(search.toLowerCase()) ||
        c.estado.toLowerCase().includes(search.toLowerCase()) ||
        c.proveedor?.nombre.toLowerCase().includes(search.toLowerCase())
      : true
  )

  return { compras: filtered, loading, error, pagination, search, setSearch, setPage, refetch: fetchCompras }
}
