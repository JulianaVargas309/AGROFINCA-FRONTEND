import { useState, useEffect, useCallback, useRef } from "react"
import { rendimientoService } from "../services/rendimiento.service"
import type { RendimientoLote, RendimientoCultivo } from "../types/rendimiento.types"
import type { PaginationState } from "@/types"

interface UseRendimientosReturn {
  lotes: RendimientoLote[]
  cultivos: RendimientoCultivo[]
  loading: boolean
  error: string | null
  activeTab: "lotes" | "cultivos"
  setActiveTab: (tab: "lotes" | "cultivos") => void
  refetch: () => Promise<void>
}

export function useRendimientos(limit: number = 10): UseRendimientosReturn {
  const [lotes, setLotes] = useState<RendimientoLote[]>([])
  const [cultivos, setCultivos] = useState<RendimientoCultivo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"lotes" | "cultivos">("lotes")
  const mountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [lotesResult, cultivosResult] = await Promise.all([
        rendimientoService.findAllLotes(1, limit),
        rendimientoService.findAllCultivos(1, limit),
      ])
      if (!mountedRef.current) return

      if (Array.isArray(lotesResult)) {
        setLotes(lotesResult)
      } else {
        setLotes(lotesResult.data)
      }

      if (Array.isArray(cultivosResult)) {
        setCultivos(cultivosResult)
      } else {
        setCultivos(cultivosResult.data)
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar rendimientos")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    mountedRef.current = true
    fetchData()
    return () => { mountedRef.current = false }
  }, [fetchData])

  return { lotes, cultivos, loading, error, activeTab, setActiveTab, refetch: fetchData }
}
