import { useState, useEffect, useCallback, useRef } from "react"
import { configuracionService } from "../services/configuracion.service"
import type { Configuracion } from "../types/configuracion.types"

interface UseConfiguracionReturn {
  configs: Configuracion[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useConfiguracion(): UseConfiguracionReturn {
  const [configs, setConfigs] = useState<Configuracion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchConfigs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await configuracionService.findAll()
      if (mountedRef.current) setConfigs(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar configuración")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    fetchConfigs()
    return () => { mountedRef.current = false }
  }, [fetchConfigs])

  return { configs, loading, error, refetch: fetchConfigs }
}
