import { useState, useEffect, useCallback, useRef } from "react"
import { cajaService } from "../services/caja.service"
import type { Caja, MovimientoCaja } from "../types/caja.types"

interface UseCajaReturn {
  caja: Caja | null
  movimientos: MovimientoCaja[]
  loading: boolean
  movimientosLoading: boolean
  error: string | null
  saldo: number
  refetch: () => Promise<void>
  refetchMovimientos: () => Promise<void>
}

export function useCaja(id: number | null): UseCajaReturn {
  const [caja, setCaja] = useState<Caja | null>(null)
  const [movimientos, setMovimientos] = useState<MovimientoCaja[]>([])
  const [loading, setLoading] = useState(false)
  const [movimientosLoading, setMovimientosLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saldo, setSaldo] = useState(0)
  const mountedRef = useRef(true)

  const fetchCaja = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const [cajaData, saldoData] = await Promise.all([
        cajaService.findCajaById(id),
        cajaService.getSaldo(id),
      ])
      if (mountedRef.current) {
        setCaja(cajaData)
        setSaldo(saldoData.saldo)
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar la caja")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id])

  const fetchMovimientos = useCallback(async () => {
    if (!id) return
    setMovimientosLoading(true)
    try {
      const result = await cajaService.findAllMovimientos(id)
      if (mountedRef.current) {
        setMovimientos(Array.isArray(result) ? result : result.data)
      }
    } catch {
      // Silently fail for movimientos
    } finally {
      if (mountedRef.current) setMovimientosLoading(false)
    }
  }, [id])

  useEffect(() => {
    mountedRef.current = true
    fetchCaja()
    fetchMovimientos()
    return () => { mountedRef.current = false }
  }, [fetchCaja, fetchMovimientos])

  return { caja, movimientos, loading, movimientosLoading, error, saldo, refetch: fetchCaja, refetchMovimientos: fetchMovimientos }
}
