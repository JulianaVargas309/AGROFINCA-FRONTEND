import { useState, useEffect, useCallback, useRef } from "react"
import { cajaService } from "../services/caja.service"
import type { Caja } from "../types/caja.types"

interface UseCajasReturn {
  cajas: Caja[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useCajas(): UseCajasReturn {
  const [cajas, setCajas] = useState<Caja[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchCajas = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await cajaService.findAllCajas()
      if (mountedRef.current) setCajas(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar cajas")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    fetchCajas()
    return () => { mountedRef.current = false }
  }, [fetchCajas])

  return { cajas, loading, error, refetch: fetchCajas }
}
