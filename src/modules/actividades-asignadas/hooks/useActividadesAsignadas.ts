import { useState, useEffect, useCallback, useRef } from "react"
import { actividadAsignadaService } from "../services/actividades-asignadas.service"
import type { ActividadAsignada } from "../types/actividades-asignadas.types"
import type { PaginationState } from "@/types"

interface UseActividadesAsignadasReturn {
  actividades: ActividadAsignada[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  trabajadorFilter: number | undefined
  setTrabajadorFilter: (id: number | undefined) => void
  estadoFilter: string | undefined
  setEstadoFilter: (estado: string | undefined) => void
  search: string
  setSearch: (search: string) => void
  setPage: (page: number) => void
  refetch: () => Promise<void>
}

export function useActividadesAsignadas(limit: number = 10): UseActividadesAsignadasReturn {
  const [actividades, setActividades] = useState<ActividadAsignada[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1, limit, total: 0, totalPages: 1,
  })
  const [trabajadorFilter, setTrabajadorFilter] = useState<number | undefined>(undefined)
  const [estadoFilter, setEstadoFilter] = useState<string | undefined>(undefined)
  const [search, setSearch] = useState("")
  const mountedRef = useRef(true)

  const fetchActividades = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await actividadAsignadaService.findAll(trabajadorFilter, estadoFilter, pagination.page, pagination.limit)
      if (!mountedRef.current) return
      if (Array.isArray(result)) {
        setActividades(result)
        setPagination((prev) => ({ ...prev, total: result.length, totalPages: 1 }))
      } else {
        setActividades(result.data)
        setPagination((prev) => ({ ...prev, total: result.meta.total, totalPages: result.meta.totalPages }))
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar actividades")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [trabajadorFilter, estadoFilter, pagination.page, pagination.limit])

  useEffect(() => {
    mountedRef.current = true
    fetchActividades()
    return () => { mountedRef.current = false }
  }, [fetchActividades])

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  const filtered = actividades.filter((a) =>
    search
      ? a.titulo.toLowerCase().includes(search.toLowerCase()) ||
        a.descripcion?.toLowerCase().includes(search.toLowerCase())
      : true
  )

  return { actividades: filtered, loading, error, pagination, trabajadorFilter, setTrabajadorFilter, estadoFilter, setEstadoFilter, search, setSearch, setPage, refetch: fetchActividades }
}
