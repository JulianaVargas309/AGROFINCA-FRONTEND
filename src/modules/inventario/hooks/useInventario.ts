import { useState, useEffect, useCallback, useRef } from "react"
import { inventarioService } from "../services/inventario.service"
import type { Producto } from "../types/inventario.types"

interface UseInventarioReturn {
  productos: Producto[]
  loading: boolean
  error: string | null
  search: string
  setSearch: (s: string) => void
  categoriaFilter: string
  setCategoriaFilter: (c: string) => void
  stockBajo: Producto[]
  refetch: () => Promise<void>
}

export function useInventario(): UseInventarioReturn {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState("")
  const mountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await inventarioService.findAll()
      if (mountedRef.current) setProductos(Array.isArray(result) ? result : [])
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar inventario")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    fetchData()
    return () => { mountedRef.current = false }
  }, [fetchData])

  const filtered = productos.filter((p) => {
    const matchSearch = search
      ? p.nombre.toLowerCase().includes(search.toLowerCase())
      : true
    const matchCategoria = categoriaFilter
      ? (p.categoria || "").toLowerCase() === categoriaFilter.toLowerCase()
      : true
    return matchSearch && matchCategoria
  })

  const stockBajo = productos.filter((p) => p.stockActual <= p.stockMinimo)

  return {
    productos: filtered,
    loading,
    error,
    search,
    setSearch,
    categoriaFilter,
    setCategoriaFilter,
    stockBajo,
    refetch: fetchData,
  }
}
