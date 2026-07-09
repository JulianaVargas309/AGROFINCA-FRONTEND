import { useState, useEffect, useCallback, useRef } from "react"
import { trabajadorService } from "../services/trabajador.service"
import type { Trabajador } from "../types/trabajador.types"
import type { PaginationState } from "@/types"

interface UseTrabajadoresReturn {
  trabajadores: Trabajador[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  search: string
  setSearch: (search: string) => void
  setPage: (page: number) => void
  refetch: () => Promise<void>
}

export function useTrabajadores(limit: number = 10): UseTrabajadoresReturn {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1, limit, total: 0, totalPages: 1,
  })
  const [search, setSearch] = useState("")
  const mountedRef = useRef(true)

  const fetchTrabajadores = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await trabajadorService.findAll(pagination.page, pagination.limit)
      if (!mountedRef.current) return
      if (Array.isArray(result)) {
        setTrabajadores(result)
        setPagination((prev) => ({ ...prev, total: result.length, totalPages: 1 }))
      } else {
        setTrabajadores(result.data)
        setPagination((prev) => ({ ...prev, total: result.meta.total, totalPages: result.meta.totalPages }))
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar trabajadores")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    mountedRef.current = true
    fetchTrabajadores()
    return () => { mountedRef.current = false }
  }, [fetchTrabajadores])

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  const filtered = trabajadores.filter((t) =>
    search
      ? t.nombre.toLowerCase().includes(search.toLowerCase()) ||
        t.documento.toLowerCase().includes(search.toLowerCase())
      : true
  )

  return { trabajadores: filtered, loading, error, pagination, search, setSearch, setPage, refetch: fetchTrabajadores }
}
