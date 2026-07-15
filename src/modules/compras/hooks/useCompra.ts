import { useState, useEffect, useCallback, useRef } from "react"
import { compraService } from "../services/compra.service"
import type { Compra } from "../types/compras.types"

interface UseCompraReturn {
  compra: Compra | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useCompra(id: number | null): UseCompraReturn {
  const [compra, setCompra] = useState<Compra | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchCompra = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const result = await compraService.findById(id)
      if (mountedRef.current) setCompra(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar la compra")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    mountedRef.current = true
    fetchCompra()
    return () => { mountedRef.current = false }
  }, [fetchCompra])

  return { compra, loading, error, refetch: fetchCompra }
}
