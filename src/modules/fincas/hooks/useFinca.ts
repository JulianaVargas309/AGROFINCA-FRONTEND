import { useState, useEffect, useCallback, useRef } from "react"
import { fincaService } from "../services/finca.service"
import type { Finca } from "../types/finca.types"

interface UseFincaReturn {
  finca: Finca | null
  loading: boolean
  error: string | null
  saving: boolean
  deleting: boolean
  updateFinca: (id: number, data: Partial<Finca>) => Promise<void>
  deleteFinca: (id: number) => Promise<void>
  refetch: () => Promise<void>
}

export function useFinca(id: number | null): UseFincaReturn {
  const [finca, setFinca] = useState<Finca | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const mountedRef = useRef(true)

  const fetchFinca = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const result = await fincaService.findById(id)
      if (mountedRef.current) setFinca(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar la finca")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    mountedRef.current = true
    fetchFinca()
    return () => { mountedRef.current = false }
  }, [fetchFinca])

  const updateFinca = useCallback(async (fincaId: number, data: Partial<Finca>) => {
    setSaving(true)
    setError(null)
    try {
      const updated = await fincaService.update(fincaId, data)
      if (mountedRef.current) setFinca(updated)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al actualizar la finca")
      }
    } finally {
      if (mountedRef.current) setSaving(false)
    }
  }, [])

  const deleteFinca = useCallback(async (fincaId: number) => {
    setDeleting(true)
    setError(null)
    try {
      await fincaService.remove(fincaId)
      if (mountedRef.current) setFinca(null)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al eliminar la finca")
      }
    } finally {
      if (mountedRef.current) setDeleting(false)
    }
  }, [])

  return { finca, loading, error, saving, deleting, updateFinca, deleteFinca, refetch: fetchFinca }
}
