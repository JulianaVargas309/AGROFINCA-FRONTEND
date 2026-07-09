import { useState, useEffect, useCallback, useRef } from "react"
import { trabajadorService } from "../services/trabajador.service"
import type { Trabajador } from "../types/trabajador.types"

interface UseTrabajadorReturn {
  trabajador: Trabajador | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useTrabajador(id: number | null): UseTrabajadorReturn {
  const [trabajador, setTrabajador] = useState<Trabajador | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchTrabajador = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const result = await trabajadorService.findById(id)
      if (mountedRef.current) setTrabajador(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar el trabajador")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    mountedRef.current = true
    fetchTrabajador()
    return () => { mountedRef.current = false }
  }, [fetchTrabajador])

  return { trabajador, loading, error, refetch: fetchTrabajador }
}
