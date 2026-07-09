import { useState, useEffect, useCallback, useRef } from "react"
import { ventaService } from "../services/venta.service"
import type { Venta } from "../types/venta.types"
import type { PaginationState } from "@/types"

interface UseVentasReturn {
  ventas: Venta[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  search: string
  setSearch: (search: string) => void
  setPage: (page: number) => void
  refetch: () => Promise<void>
}

export function useVentas(limit: number = 10): UseVentasReturn {
  const [ventas, setVentas] = useState<Venta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1, limit, total: 0, totalPages: 1,
  })
  const [search, setSearch] = useState("")
  const mountedRef = useRef(true)

  const fetchVentas = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await ventaService.findAll(pagination.page, pagination.limit)
      if (!mountedRef.current) return
      if (Array.isArray(result)) {
        setVentas(result)
        setPagination((prev) => ({ ...prev, total: result.length, totalPages: 1 }))
      } else {
        setVentas(result.data)
        setPagination((prev) => ({ ...prev, total: result.meta.total, totalPages: result.meta.totalPages }))
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar ventas")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    mountedRef.current = true
    fetchVentas()
    return () => { mountedRef.current = false }
  }, [fetchVentas])

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  const filtered = ventas.filter((v) =>
    search
      ? v.cliente.toLowerCase().includes(search.toLowerCase()) ||
        v.tipoProducto.toLowerCase().includes(search.toLowerCase())
      : true
  )

  return { ventas: filtered, loading, error, pagination, search, setSearch, setPage, refetch: fetchVentas }
}
