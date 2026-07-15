import { useState, useEffect, useCallback, useRef } from "react"
import { notificacionService } from "../services/notificaciones.service"
import type { Notificacion } from "../types/notificaciones.types"
import type { PaginationState } from "@/types"

interface UseNotificacionesReturn {
  notificaciones: Notificacion[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  noLeidasCount: number
  filtroLeida: string
  setFiltroLeida: (filtro: string) => void
  setPage: (page: number) => void
  refetch: () => Promise<void>
  handleMarcarLeida: (id: number) => Promise<void>
  handleMarcarTodasLeidas: () => Promise<void>
  handleEliminar: (id: number) => Promise<void>
}

export function useNotificaciones(limit: number = 20): UseNotificacionesReturn {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, limit, total: 0, totalPages: 1 })
  const [noLeidasCount, setNoLeidasCount] = useState(0)
  const [filtroLeida, setFiltroLeida] = useState("")
  const mountedRef = useRef(true)

  const fetchNotificaciones = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [result, countData] = await Promise.all([
        notificacionService.findAll(pagination.page, pagination.limit),
        notificacionService.getNoLeidasCount(),
      ])
      if (!mountedRef.current) return
      if (Array.isArray(result)) {
        setNotificaciones(result)
        setPagination((prev) => ({ ...prev, total: result.length, totalPages: 1 }))
      } else {
        setNotificaciones(result.data)
        setPagination((prev) => ({ ...prev, total: result.meta.total, totalPages: result.meta.totalPages }))
      }
      setNoLeidasCount(countData.count)
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Error al cargar notificaciones")
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    mountedRef.current = true
    fetchNotificaciones()
    return () => { mountedRef.current = false }
  }, [fetchNotificaciones])

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  const handleMarcarLeida = useCallback(async (id: number) => {
    try {
      await notificacionService.marcarLeida(id)
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      )
      setNoLeidasCount((prev) => Math.max(0, prev - 1))
    } catch {
      // silent
    }
  }, [])

  const handleMarcarTodasLeidas = useCallback(async () => {
    try {
      await notificacionService.marcarTodasLeidas()
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })))
      setNoLeidasCount(0)
    } catch {
      // silent
    }
  }, [])

  const handleEliminar = useCallback(async (id: number) => {
    try {
      await notificacionService.remove(id)
      setNotificaciones((prev) => prev.filter((n) => n.id !== id))
    } catch {
      // silent
    }
  }, [])

  const filtered = notificaciones.filter((n) => {
    if (filtroLeida === "leidas") return n.leida
    if (filtroLeida === "noLeidas") return !n.leida
    return true
  })

  return {
    notificaciones: filtered,
    loading,
    error,
    pagination,
    noLeidasCount,
    filtroLeida,
    setFiltroLeida,
    setPage,
    refetch: fetchNotificaciones,
    handleMarcarLeida,
    handleMarcarTodasLeidas,
    handleEliminar,
  }
}
