import { useState, useEffect, useCallback, useRef } from "react"
import { bitacoraService } from "../services/bitacora.service"
import type { Bitacora } from "../types/bitacora.types"

interface UseBitacoraEntryReturn {
  entry: Bitacora | null
  loading: boolean
  error: string | null
  saving: boolean
  deleting: boolean
  updateEntry: (id: number, data: Partial<Bitacora>) => Promise<void>
  deleteEntry: (id: number) => Promise<void>
}

export function useBitacoraEntry(id: number | null): UseBitacoraEntryReturn {
  const [entry, setEntry] = useState<Bitacora | null>(null)
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
      const result = await bitacoraService.findById(id)
      if (mountedRef.current) setEntry(result)
    } catch (err) {
      if (mountedRef.current) setError(err instanceof Error ? err.message : "Error al cargar")
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    mountedRef.current = true
    fetchData()
    return () => { mountedRef.current = false }
  }, [fetchData])

  const updateEntry = useCallback(async (entryId: number, data: Partial<Bitacora>) => {
    setSaving(true)
    setError(null)
    try {
      const updated = await bitacoraService.update(entryId, data)
      if (mountedRef.current) setEntry(updated)
    } catch (err) {
      if (mountedRef.current) setError(err instanceof Error ? err.message : "Error al actualizar")
    } finally {
      if (mountedRef.current) setSaving(false)
    }
  }, [])

  const deleteEntry = useCallback(async (entryId: number) => {
    setDeleting(true)
    setError(null)
    try {
      await bitacoraService.remove(entryId)
      if (mountedRef.current) setEntry(null)
    } catch (err) {
      if (mountedRef.current) setError(err instanceof Error ? err.message : "Error al eliminar")
    } finally {
      if (mountedRef.current) setDeleting(false)
    }
  }, [])

  return { entry, loading, error, saving, deleting, updateEntry, deleteEntry }
}
