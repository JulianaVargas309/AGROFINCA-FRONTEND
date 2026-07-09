import { useState, useEffect, useCallback, useRef } from "react"
import { cultivoService } from "../services/cultivo.service"
import type { Cultivo } from "../types/cultivo.types"
import type { PaginationState } from "@/types"

interface UseCultivosReturn {
  cultivos: Cultivo[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  search: string
  setSearch: (search: string) => void
  setPage: (page: number) => void
  refetch: () => Promise<void>
}

export function useCultivos(limit: number = 10): UseCultivosReturn {
  const [cultivos, setCultivos] = useState<Cultivo[]>([])
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

  const fetchCultivos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await cultivoService.findAll(pagination.page, pagination.limit)
      if (!mountedRef.current) return

      if (Array.isArray(result)) {
        setCultivos(result)
        setPagination((prev) => ({ ...prev, total: result.length, totalPages: 1 }))
      } else {
        setCultivos(result.data)
        setPagination((prev) => ({ ...prev, total: result.meta.total, totalPages: result.meta.totalPages }))
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar cultivos")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    mountedRef.current = true
    fetchCultivos()
    return () => { mountedRef.current = false }
  }, [fetchCultivos])

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  const filteredCultivos = cultivos.filter((c) =>
    search
      ? c.nombre.toLowerCase().includes(search.toLowerCase())
      : true
  )

  return { cultivos: filteredCultivos, loading, error, pagination, search, setSearch, setPage, refetch: fetchCultivos }
}
