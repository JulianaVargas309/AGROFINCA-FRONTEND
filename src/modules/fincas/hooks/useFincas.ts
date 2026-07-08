import { useState, useEffect, useCallback, useRef } from "react"
import { fincaService } from "../services/finca.service"
import type { Finca } from "../types/finca.types"
import type { PaginationState } from "@/types"

interface UseFincasReturn {
  fincas: Finca[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  search: string
  setSearch: (search: string) => void
  setPage: (page: number) => void
  refetch: () => Promise<void>
}

export function useFincas(limit: number = 10): UseFincasReturn {
  const [fincas, setFincas] = useState<Finca[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit,
    total: 0,
    totalPages: 1,
  })
  const [search, setSearch] = useState("")
  const mountedRef = useRef(true)

  const fetchFincas = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fincaService.findAll(pagination.page, pagination.limit)

      if (!mountedRef.current) return

      if (Array.isArray(result)) {
        setFincas(result)
        setPagination((prev) => ({
          ...prev,
          total: result.length,
          totalPages: 1,
        }))
      } else {
        setFincas(result.data)
        setPagination((prev) => ({
          ...prev,
          total: result.meta.total,
          totalPages: result.meta.totalPages,
        }))
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar fincas")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    mountedRef.current = true
    fetchFincas()
    return () => { mountedRef.current = false }
  }, [fetchFincas])

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  const filteredFincas = fincas.filter((f) =>
    search
      ? f.nombre.toLowerCase().includes(search.toLowerCase()) ||
        f.ubicacion?.toLowerCase().includes(search.toLowerCase())
      : true
  )

  return {
    fincas: filteredFincas,
    loading,
    error,
    pagination,
    search,
    setSearch,
    setPage,
    refetch: fetchFincas,
  }
}
