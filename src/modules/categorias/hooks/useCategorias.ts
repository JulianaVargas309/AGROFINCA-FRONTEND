import { useState, useEffect, useCallback, useRef } from "react"
import { categoriaService } from "../services/categoria.service"
import type { CategoriaProducto } from "../types/categoria.types"
import type { PaginationState } from "@/types"

interface UseCategoriasReturn {
  categorias: CategoriaProducto[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  search: string
  setSearch: (search: string) => void
  setPage: (page: number) => void
  refetch: () => Promise<void>
}

export function useCategorias(limit: number = 10): UseCategoriasReturn {
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([])
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

  const fetchCategorias = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await categoriaService.findAll(pagination.page, pagination.limit)
      if (!mountedRef.current) return

      if (Array.isArray(result)) {
        setCategorias(result)
        setPagination((prev) => ({ ...prev, total: result.length, totalPages: 1 }))
      } else {
        setCategorias(result.data)
        setPagination((prev) => ({ ...prev, total: result.meta.total, totalPages: result.meta.totalPages }))
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar categorías")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    mountedRef.current = true
    fetchCategorias()
    return () => { mountedRef.current = false }
  }, [fetchCategorias])

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  const filteredCategorias = categorias.filter((c) =>
    search
      ? c.nombre.toLowerCase().includes(search.toLowerCase())
      : true
  )

  return { categorias: filteredCategorias, loading, error, pagination, search, setSearch, setPage, refetch: fetchCategorias }
}
