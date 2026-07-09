import { useState, useEffect, useCallback, useRef } from "react"
import { jornalService } from "../services/jornal.service"
import type { Jornal } from "../types/jornal.types"
import type { PaginationState } from "@/types"

interface UseJornalesReturn {
  jornales: Jornal[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  search: string
  setSearch: (search: string) => void
  setPage: (page: number) => void
  refetch: () => Promise<void>
}

export function useJornales(limit: number = 10): UseJornalesReturn {
  const [jornales, setJornales] = useState<Jornal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1, limit, total: 0, totalPages: 1,
  })
  const [search, setSearch] = useState("")
  const mountedRef = useRef(true)

  const fetchJornales = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await jornalService.findAll(pagination.page, pagination.limit)
      if (!mountedRef.current) return
      if (Array.isArray(result)) {
        setJornales(result)
        setPagination((prev) => ({ ...prev, total: result.length, totalPages: 1 }))
      } else {
        setJornales(result.data)
        setPagination((prev) => ({ ...prev, total: result.meta.total, totalPages: result.meta.totalPages }))
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar jornales")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    mountedRef.current = true
    fetchJornales()
    return () => { mountedRef.current = false }
  }, [fetchJornales])

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  const filtered = jornales.filter((j) =>
    search
      ? j.trabajador?.nombre.toLowerCase().includes(search.toLowerCase())
      : true
  )

  return { jornales: filtered, loading, error, pagination, search, setSearch, setPage, refetch: fetchJornales }
}
