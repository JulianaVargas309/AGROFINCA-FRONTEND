import { useState, useEffect, useCallback, useRef } from "react"
import { temporadaService } from "../services/temporada.service"
import type { Temporada } from "../types/temporada.types"
import type { PaginationState } from "@/types"

interface UseTemporadasReturn {
  temporadas: Temporada[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  search: string
  setSearch: (search: string) => void
  setPage: (page: number) => void
  refetch: () => Promise<void>
}

export function useTemporadas(limit: number = 10): UseTemporadasReturn {
  const [temporadas, setTemporadas] = useState<Temporada[]>([])
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

  const fetchTemporadas = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await temporadaService.findAll(pagination.page, pagination.limit)
      if (!mountedRef.current) return

      if (Array.isArray(result)) {
        setTemporadas(result)
        setPagination((prev) => ({ ...prev, total: result.length, totalPages: 1 }))
      } else {
        setTemporadas(result.data)
        setPagination((prev) => ({ ...prev, total: result.meta.total, totalPages: result.meta.totalPages }))
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar temporadas")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    mountedRef.current = true
    fetchTemporadas()
    return () => { mountedRef.current = false }
  }, [fetchTemporadas])

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  const filteredTemporadas = temporadas.filter((t) =>
    search
      ? t.nombre.toLowerCase().includes(search.toLowerCase())
      : true
  )

  return { temporadas: filteredTemporadas, loading, error, pagination, search, setSearch, setPage, refetch: fetchTemporadas }
}
