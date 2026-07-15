import { useState, useEffect, useCallback, useRef } from "react"
import { categoriaService } from "../services/categoria.service"
import type { CategoriaProducto } from "../types/categoria.types"

interface UseCategoriaReturn {
  categoria: CategoriaProducto | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useCategoria(id: number | null): UseCategoriaReturn {
  const [categoria, setCategoria] = useState<CategoriaProducto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchCategoria = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const result = await categoriaService.findById(id)
      if (mountedRef.current) setCategoria(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar la categoría")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    mountedRef.current = true
    fetchCategoria()
    return () => { mountedRef.current = false }
  }, [fetchCategoria])

  return { categoria, loading, error, refetch: fetchCategoria }
}
