import { useState, useEffect, useCallback, useRef } from "react"
import { auditoriaService } from "../services/auditoria.service"
import type { AuditLog } from "../types/auditoria.types"

interface UseAuditoriaReturn {
  auditoria: AuditLog | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useAuditoria(id: number | null): UseAuditoriaReturn {
  const [auditoria, setAuditoria] = useState<AuditLog | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const fetchAuditoria = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const result = await auditoriaService.findById(id)
      if (mountedRef.current) setAuditoria(result)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar el registro de auditoría")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    mountedRef.current = true
    fetchAuditoria()
    return () => { mountedRef.current = false }
  }, [fetchAuditoria])

  return { auditoria, loading, error, refetch: fetchAuditoria }
}
