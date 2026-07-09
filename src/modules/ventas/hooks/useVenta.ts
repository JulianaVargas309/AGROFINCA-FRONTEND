import { useState, useEffect, useCallback, useRef } from "react"
import { ventaService } from "../services/venta.service"
import type { Venta } from "../types/venta.types"

interface UseVentaReturn {
  venta: Venta | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useVenta(id: number | null): UseVentaReturn {
  const [venta, setVenta] = useState<Venta | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchVenta = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const result = await ventaService.findById(id)
      if (mountedRef.current) setVenta(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar la venta")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    mountedRef.current = true
    fetchVenta()
    return () => { mountedRef.current = false }
  }, [fetchVenta])

  return { venta, loading, error, refetch: fetchVenta }
}
