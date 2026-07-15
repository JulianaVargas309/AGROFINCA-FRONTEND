import { apiGet, apiPost, apiPut, apiDelete } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import type { Notificacion } from "../types/notificaciones.types"
import type { PaginatedResponse } from "@/types"

interface CreateNotificacionInput {
  titulo: string
  mensaje?: string
  tipo: string
  link?: string
}

export const notificacionService = {
  async findAll(page?: number, limit?: number): Promise<Notificacion[] | PaginatedResponse<Notificacion>> {
    const params: Record<string, unknown> = {}
    if (page) params.page = page
    if (limit) params.limit = limit
    return apiGet<Notificacion[] | PaginatedResponse<Notificacion>>(API_ENDPOINTS.NOTIFICACIONES, { params })
  },

  async findById(id: number): Promise<Notificacion> {
    return apiGet<Notificacion>(`${API_ENDPOINTS.NOTIFICACIONES}/${id}`)
  },

  async create(data: CreateNotificacionInput): Promise<Notificacion> {
    return apiPost<Notificacion>(API_ENDPOINTS.NOTIFICACIONES, data)
  },

  async marcarLeida(id: number): Promise<void> {
    return apiPut<void>(`${API_ENDPOINTS.NOTIFICACIONES}/${id}/leer`, {})
  },

  async marcarTodasLeidas(): Promise<void> {
    return apiPut<void>(`${API_ENDPOINTS.NOTIFICACIONES}/leer-todas`, {})
  },

  async getNoLeidasCount(): Promise<{ count: number }> {
    return apiGet<{ count: number }>(`${API_ENDPOINTS.NOTIFICACIONES}/no-leidas`)
  },

  async remove(id: number): Promise<void> {
    return apiDelete<void>(`${API_ENDPOINTS.NOTIFICACIONES}/${id}`)
  },
}
