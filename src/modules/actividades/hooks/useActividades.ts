import { useState, useEffect, useCallback, useRef } from "react"
import { actividadService } from "../services/actividades.service"
import type { ActividadSeguimiento } from "../types/actividades.types"
import type { PaginationState } from "@/types"

interface UseActividadesReturn {
  actividades: ActividadSeguimiento[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  search: string
  setSearch: (search: string) => void
  setPage: (page: number) => void
  refetch: () => Promise<void>
}

export function useActividades(limit: number = 10): UseActividadesReturn {
  const [actividades, setActividades] = useState<ActividadSeguimiento[]>([])
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

  const fetchActividades = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await actividadService.findAll(pagination.page, pagination.limit)
      if (!mountedRef.current) return

      if (Array.isArray(result)) {
        setActividades(result)
        setPagination((prev) => ({ ...prev, total: result.length, totalPages: 1 }))
      } else {
        setActividades((result as { data: ActividadSeguimiento[] }).data)
        setPagination((prev) => ({ ...prev, total: (result as { meta: { total: number; totalPages: number } }).meta.total, totalPages: (result as { meta: { total: number; totalPages: number } }).meta.totalPages }))
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar actividades")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    mountedRef.current = true
    fetchActividades()
    return () => { mountedRef.current = false }
  }, [fetchActividades])

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  const filteredActividades = actividades.filter((a) =>
    search
      ? a.titulo.toLowerCase().includes(search.toLowerCase())
      : true
  )

  return { actividades: filteredActividades, loading, error, pagination, search, setSearch, setPage, refetch: fetchActividades }
}
