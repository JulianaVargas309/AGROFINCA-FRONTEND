import { useState, useEffect, useCallback, useRef } from "react"
import { finanzaService } from "../services/finanza.service"
import type { Gasto, Venta } from "../types/finanza.types"

interface UseFinanzaReturn {
  gasto: Gasto | null
  venta: Venta | null
  loading: boolean
  error: string | null
  saving: boolean
  deleting: boolean
  tipo: "gasto" | "venta"
  updateGasto: (id: number, data: Partial<Gasto>) => Promise<void>
  deleteGasto: (id: number) => Promise<void>
  updateVentaEstado: (id: number, estado: string) => Promise<void>
}

export function useFinanza(id: number | null, tipo: "gasto" | "venta"): UseFinanzaReturn {
  const [gasto, setGasto] = useState<Gasto | null>(null)
  const [venta, setVenta] = useState<Venta | null>(null)
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
      if (tipo === "gasto") {
        const result = await finanzaService.findGastoById(id)
        if (mountedRef.current) setGasto(result)
      } else {
        const result = await finanzaService.findVentaById(id)
        if (mountedRef.current) setVenta(result)
      }
    } catch (err) {
      if (mountedRef.current) setError(err instanceof Error ? err.message : "Error al cargar")
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id, tipo])

  useEffect(() => {
    mountedRef.current = true
    fetchData()
    return () => { mountedRef.current = false }
  }, [fetchData])

  const updateGasto = useCallback(async (gastoId: number, data: Partial<Gasto>) => {
    setSaving(true)
    setError(null)
    try {
      const result = await finanzaService.updateGasto(gastoId, data)
      if (mountedRef.current) setGasto(result)
    } catch (err) {
      if (mountedRef.current) setError(err instanceof Error ? err.message : "Error al actualizar")
    } finally {
      if (mountedRef.current) setSaving(false)
    }
  }, [])

  const deleteGasto = useCallback(async (gastoId: number) => {
    setDeleting(true)
    setError(null)
    try {
      await finanzaService.deleteGasto(gastoId)
      if (mountedRef.current) setGasto(null)
    } catch (err) {
      if (mountedRef.current) setError(err instanceof Error ? err.message : "Error al eliminar")
    } finally {
      if (mountedRef.current) setDeleting(false)
    }
  }, [])

  const updateVentaEstado = useCallback(async (ventaId: number, estado: string) => {
    setSaving(true)
    setError(null)
    try {
      const result = await finanzaService.updateVenta(ventaId, estado)
      if (mountedRef.current) setVenta(result)
    } catch (err) {
      if (mountedRef.current) setError(err instanceof Error ? err.message : "Error al actualizar")
    } finally {
      if (mountedRef.current) setSaving(false)
    }
  }, [])

  return { gasto, venta, loading, error, saving, deleting, tipo, updateGasto, deleteGasto, updateVentaEstado }
}
