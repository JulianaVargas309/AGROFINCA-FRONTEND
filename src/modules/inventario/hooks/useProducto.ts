import { useState, useEffect, useCallback, useRef } from "react"
import { inventarioService } from "../services/inventario.service"
import type { Producto, MovimientoInventario, CreateMovimientoInput } from "../types/inventario.types"

interface UseProductoReturn {
  producto: Producto | null
  movimientos: MovimientoInventario[]
  loading: boolean
  error: string | null
  saving: boolean
  deleting: boolean
  updateProducto: (id: number, data: Partial<Producto>) => Promise<void>
  deleteProducto: (id: number) => Promise<void>
  addMovimiento: (data: CreateMovimientoInput) => Promise<void>
  refetch: () => Promise<void>
}

export function useProducto(id: number | null): UseProductoReturn {
  const [producto, setProducto] = useState<Producto | null>(null)
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const mountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const [prod, movs] = await Promise.all([
        inventarioService.findById(id),
        inventarioService.findMovimientos(id).catch(() => [] as MovimientoInventario[]),
      ])
      if (mountedRef.current) {
        setProducto(prod)
        setMovimientos(movs)
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar producto")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    mountedRef.current = true
    fetchData()
    return () => { mountedRef.current = false }
  }, [fetchData])

  const updateProducto = useCallback(async (prodId: number, data: Partial<Producto>) => {
    setSaving(true)
    setError(null)
    try {
      const updated = await inventarioService.update(prodId, data)
      if (mountedRef.current) setProducto(updated)
    } catch (err) {
      if (mountedRef.current) setError(err instanceof Error ? err.message : "Error al actualizar")
    } finally {
      if (mountedRef.current) setSaving(false)
    }
  }, [])

  const deleteProducto = useCallback(async (prodId: number) => {
    setDeleting(true)
    setError(null)
    try {
      await inventarioService.remove(prodId)
      if (mountedRef.current) {
        setProducto((prev) => prev ? { ...prev, activo: false } : null)
      }
    } catch (err) {
      if (mountedRef.current) setError(err instanceof Error ? err.message : "Error al eliminar")
    } finally {
      if (mountedRef.current) setDeleting(false)
    }
  }, [])

  const addMovimiento = useCallback(async (data: CreateMovimientoInput) => {
    setSaving(true)
    setError(null)
    try {
      await inventarioService.createMovimiento(data)
      await fetchData()
    } catch (err) {
      if (mountedRef.current) setError(err instanceof Error ? err.message : "Error al registrar movimiento")
    } finally {
      if (mountedRef.current) setSaving(false)
    }
  }, [fetchData])

  return { producto, movimientos, loading, error, saving, deleting, updateProducto, deleteProducto, addMovimiento, refetch: fetchData }
}
