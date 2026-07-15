import { useState, useEffect, useCallback, useRef } from "react"
import { presupuestoService } from "../services/presupuestos.service"
import type { Presupuesto } from "../types/presupuestos.types"

interface UsePresupuestoReturn {
  presupuesto: Presupuesto | null
  loading: boolean
  error: string | null
  updatingEstado: boolean
  updateEstado: (id: number, estado: Presupuesto["estado"]) => Promise<void>
  refetch: () => Promise<void>
}

export function usePresupuesto(id: number | null): UsePresupuestoReturn {
  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updatingEstado, setUpdatingEstado] = useState(false)
  const mountedRef = useRef(true)

  const fetchPresupuesto = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const result = await presupuestoService.findById(id)
      if (mountedRef.current) setPresupuesto(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar el presupuesto")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    mountedRef.current = true
    fetchPresupuesto()
    return () => { mountedRef.current = false }
  }, [fetchPresupuesto])

  const updateEstado = useCallback(async (presupuestoId: number, estado: Presupuesto["estado"]) => {
    setUpdatingEstado(true)
    try {
      const result = await presupuestoService.updateEstado(presupuestoId, estado)
      if (mountedRef.current) setPresupuesto(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al actualizar estado")
      }
    } finally {
      if (mountedRef.current) setUpdatingEstado(false)
    }
  }, [])

  return { presupuesto, loading, error, updatingEstado, updateEstado, refetch: fetchPresupuesto }
}
